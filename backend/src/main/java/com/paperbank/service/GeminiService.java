package com.paperbank.service;

import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;

import java.util.List;

@Service
public class GeminiService {

    private final ChatModel chatModel;

    public GeminiService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    /**
     * Analyze a question paper image and generate solutions.
     */
    public String analyzePaperImage(byte[] imageBytes, String fileType) {
        try {
            MimeType mimeType = getMimeType(fileType);
            ByteArrayResource resource = new ByteArrayResource(imageBytes);
            Media media = new Media(mimeType, resource);

            SystemMessage systemMessage = new SystemMessage(
                    "You are an expert academic tutor. When given a question paper image, analyze it thoroughly and generate a well-structured markdown document using the following hierarchy:\n\n" +
                    "## 📋 EXAM OVERVIEW & SUMMARY\n" +
                    "- **Subject:** [Subject Name]\n" +
                    "- **Exam Status/Difficulty:** [Provide a quick rating like Easy, Medium, or Hard based on the concepts]\n" +
                    "- **Core Topics Covered:** [Short list of main topics]\n\n" +
                    "## 📝 DETAILED SOLUTIONS (QUESTION-BY-QUESTION)\n" +
                    "For each extracted question, structure your answer as follows:\n\n" +
                    "### ❓ Question [Number]: [Question Text]\n" +
                    "- **Topic/Key Concept:** *[e.g., Database Normalization, Dynamic Programming, Integration]*\n" +
                    "- **Difficulty Level:** `[Easy/Medium/Hard]`\n" +
                    "- **Step-by-Step Solution:**\n" +
                    "  [Provide a detailed, clear, mathematical/logical step-by-step breakdown. If code is needed, use formatted code blocks. If equations are needed, format them cleanly.]\n" +
                    "- **💡 Pro-Tip / Common Mistakes:** *[Provide useful hints, shortcuts, or standard pitfalls to watch out for]*\n\n" +
                    "## 📚 EXAM STUDY SHEET & FORMULAS\n" +
                    "- [List key formulas, definitions, or critical cheat-sheet concepts relevant to this paper]\n\n" +
                    "## 🎯 PREPARATION RECOMMENDATIONS\n" +
                    "- [Suggest 2-3 focus areas or strategy suggestions for a student preparing for this specific exam]"
            );

            UserMessage userMessage = UserMessage.builder()
                    .text("Please analyze this question paper. Extract all questions and provide " +
                          "detailed solutions with step-by-step explanations for each question.")
                    .media(media)
                    .build();

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error analyzing paper: " + e.getMessage();
        }
    }

    /**
     * Answer a general user query about academic topics.
     */
    public String chat(String userQuery) {
        try {
            SystemMessage systemMessage = new SystemMessage(
                    "You are an expert academic tutor helping college students prepare for exams. When answering questions, structure your response beautifully with markdown:\n\n" +
                    "- **Use clear bold headings** to break down concepts.\n" +
                    "- **Use bulleted lists** for steps, key points, or examples.\n" +
                    "- **Wrap code blocks** or calculations in proper syntax highlighting.\n" +
                    "- Highlight key takeaways in *italicized notes* or code markers.\n" +
                    "Be highly accurate, friendly, and structured. Always provide practical examples where possible."
            );

            UserMessage userMessage = new UserMessage(userQuery);

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing query: " + e.getMessage();
        }
    }

    /**
     * Unified method to analyze a question paper file (PDF or image) and generate solutions.
     */
    public String analyzePaperFile(byte[] fileBytes, String fileType, String paperTitle, String subjectName, String subjectCode,
                                   Integer year, Integer semester) {
        try {
            MimeType mimeType = getMimeType(fileType);
            ByteArrayResource resource = new ByteArrayResource(fileBytes);
            Media media = new Media(mimeType, resource);

            SystemMessage systemMessage = new SystemMessage(
                    "You are an expert academic tutor. You are given a university/college question paper file (image or PDF). " +
                    "Your task is to analyze it thoroughly, extract the actual questions from the paper, and generate accurate, step-by-step solutions for them.\n\n" +
                    "CRITICAL INSTRUCTIONS:\n" +
                    "1. Do NOT guess or generate random mock questions. You must solve the ACTUAL questions present in the uploaded paper.\n" +
                    "2. Maintain the structure, Sections, Parts, or Series (e.g., Section A, Section B, Part 1, Part 2, Group A, Group B, Series A/B/C) as printed in the exam paper.\n" +
                    "3. Extract and list each question exactly as written in the paper before providing its solution.\n" +
                    "4. Provide detailed, correct, and academically rigorous step-by-step solutions. Use clear code blocks for programming questions and formatted math blocks for mathematical equations.\n\n" +
                    "Format the output as a beautiful markdown document using this structure:\n\n" +
                    "# 🎓 SOLVED QUESTION PAPER\n\n" +
                    "## 📋 EXAM SUMMARY\n" +
                    "- **Paper Title:** " + paperTitle + "\n" +
                    "- **Subject:** " + subjectName + " (" + subjectCode + ")\n" +
                    "- **Year & Semester:** Year " + year + ", Semester " + semester + "\n" +
                    "- **Overall Difficulty:** [Easy / Medium / Hard with brief reasoning]\n" +
                    "- **Key Topics Identified:** [Brief comma-separated list of topics]\n\n" +
                    "## 📝 SOLUTIONS BY SECTION/SERIES\n\n" +
                    "For each Section/Part/Series found in the paper, create a heading and list the questions and solutions:\n\n" +
                    "### [Section / Part / Series Name, e.g., Section A]\n\n" +
                    "#### ❓ Question [Number/ID]: [Exact Question Text from the paper]\n" +
                    "- **Key Concept:** *[e.g., Database Normalization, Integration]*\n" +
                    "- **Solution:**\n" +
                    "  [Provide the detailed, step-by-step explanation or code implementation here]\n" +
                    "- **💡 Exam Tip:** *[Hint/best practice or common mistake to avoid]*\n\n" +
                    "*(Repeat the Question template for all questions in the section)*\n\n" +
                    "## 📚 KEY FORMULAS & CHEAT SHEET\n" +
                    "- [List core definitions, formulas, or quick summary concepts extracted from this exam]\n\n" +
                    "## 🎯 PREPARATION RECOMMENDATIONS\n" +
                    "- [List 3-4 steps/topics the student should study based on this exam's coverage]"
            );

            UserMessage userMessage = UserMessage.builder()
                    .text("Extract and solve all the actual questions from the attached question paper, preserving its sections, series, and structure.")
                    .media(media)
                    .build();

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error analyzing paper: " + e.getMessage();
        }
    }

    /**
     * Analyze a PDF paper by extracting text context and generating solutions (Fallback).
     */
    public String analyzePaperPdf(String paperTitle, String subjectName, String subjectCode,
                                   Integer year, Integer semester) {
        try {
            String promptText = String.format(
                    "Generate a comprehensive set of expected questions and detailed solutions for the following exam paper:\n\n" +
                    "- Title: %s\n" +
                    "- Subject: %s (%s)\n" +
                    "- Year: %d\n" +
                    "- Semester: %d\n\n" +
                    "Please provide:\n" +
                    "1. Likely questions that would appear in this exam\n" +
                    "2. Detailed step-by-step solutions for each question\n" +
                    "3. Key concepts and formulas relevant to this subject\n" +
                    "4. Important tips for exam preparation",
                    paperTitle, subjectName, subjectCode, year, semester
            );

            SystemMessage systemMessage = new SystemMessage(
                    "You are an expert academic tutor. Generate a comprehensive exam preparation guide based on the provided metadata using this exact structure:\n\n" +
                    "# 🎯 COMPREHENSIVE STUDY GUIDE\n\n" +
                    "## 📋 EXAM PROFILE\n" +
                    "- **Course & Title:** [Course Name] - [Paper Title]\n" +
                    "- **Subject Name & Code:** [Subject] ([Code])\n" +
                    "- **Academic Year & Semester:** Year [Year], Semester [Sem]\n\n" +
                    "## 📝 PREDICTED PRACTICE QUESTIONS & SOLUTIONS\n" +
                    "Generate 4-5 high-probability practice questions based on the exam details, structured as follows:\n\n" +
                    "### ❓ Question [Number]: [Question Text]\n" +
                    "- **Core Concept:** *[Topic]*\n" +
                    "- **Detailed Solution:**\n" +
                    "  [Provide a thorough, step-by-step resolution]\n" +
                    "- **💡 Exam Tip:** *[Advice for getting full marks]*\n\n" +
                    "## 📚 ESSENTIAL FORMULAS & CHEAT SHEET\n" +
                    "- [List core definitions, formulas, or quick summary concepts]\n\n" +
                    "## 🎯 RECOMMENDED REVISION PATH\n" +
                    "- [List 3-4 steps/topics the student should study first]"
            );

            UserMessage userMessage = new UserMessage(promptText);

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error analyzing paper: " + e.getMessage();
        }
    }

    private MimeType getMimeType(String fileType) {
        return switch (fileType.toLowerCase()) {
            case "jpg", "jpeg" -> MimeTypeUtils.IMAGE_JPEG;
            case "png" -> MimeTypeUtils.IMAGE_PNG;
            case "pdf" -> MimeType.valueOf("application/pdf");
            default -> MimeTypeUtils.APPLICATION_OCTET_STREAM;
        };
    }
}
