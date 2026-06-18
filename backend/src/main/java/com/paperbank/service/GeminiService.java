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
                    "You are an expert academic tutor. When given a question paper image, " +
                    "extract all questions and provide detailed, step-by-step solutions. " +
                    "Format your response clearly with question numbers and organized answers. " +
                    "Use markdown formatting for better readability."
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
            return "Error analyzing paper: " + e.getMessage();
        }
    }

    /**
     * Answer a general user query about academic topics.
     */
    public String chat(String userQuery) {
        try {
            SystemMessage systemMessage = new SystemMessage(
                    "You are an expert academic tutor helping college students prepare for exams. " +
                    "Provide clear, detailed, and accurate answers. Use examples where appropriate. " +
                    "Format your response with markdown for better readability."
            );

            UserMessage userMessage = new UserMessage(userQuery);

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            return "Error processing query: " + e.getMessage();
        }
    }

    /**
     * Analyze a PDF paper by extracting text context and generating solutions.
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
                    "You are an expert academic tutor. Generate comprehensive exam preparation " +
                    "material based on the exam paper details provided. Be thorough and accurate."
            );

            UserMessage userMessage = new UserMessage(promptText);

            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));
            ChatResponse response = chatModel.call(prompt);
            return response.getResult().getOutput().getText();

        } catch (Exception e) {
            return "Error analyzing paper: " + e.getMessage();
        }
    }

    private MimeType getMimeType(String fileType) {
        return switch (fileType.toLowerCase()) {
            case "jpg", "jpeg" -> MimeTypeUtils.IMAGE_JPEG;
            case "png" -> MimeTypeUtils.IMAGE_PNG;
            default -> MimeTypeUtils.APPLICATION_OCTET_STREAM;
        };
    }
}
