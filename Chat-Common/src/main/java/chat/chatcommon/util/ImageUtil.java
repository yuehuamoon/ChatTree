package chat.chatcommon.util;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

public class ImageUtil {

    /**
     * Base64 转 MultipartFile
     * @param base64Data Base64 字符串（可带 data:image/png;base64, 前缀）
     * @param fileName 文件名
     * @return MultipartFile 对象
     */
    public static MultipartFile base64ToMultipartFile(String base64Data, String fileName) {
        try {
            // 1. 去除前缀
            if (base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }

            // 2. 解码 Base64
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // 3. 确定文件类型
            String contentType = detectContentType(base64Data);
            if (!fileName.contains(".")) {
                fileName = fileName + getFileExtension(contentType);
            }

            // 4. 返回 MultipartFile
            return new MockMultipartFile("file", fileName, contentType, imageBytes);

        } catch (Exception e) {
            throw new RuntimeException("Base64 转换失败: " + e.getMessage(), e);
        }
    }

    /**
     * 检测图片类型
     */
    private static String detectContentType(String base64Data) {
        if (base64Data.startsWith("/9j/")) return "image/jpeg";
        if (base64Data.startsWith("iVBORw0KGgo")) return "image/png";
        if (base64Data.startsWith("R0lGODlh")) return "image/gif";
        return "image/jpeg"; // 默认
    }

    /**
     * 根据 ContentType 获取文件扩展名
     */
    private static String getFileExtension(String contentType) {
        switch (contentType) {
            case "image/png": return ".png";
            case "image/gif": return ".gif";
            case "image/jpeg":
            default: return ".jpg";
        }
    }
}