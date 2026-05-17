package chat.chatoss.util;

import chat.chatoss.client.OssFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class OSSUtil {

    /**
     * 将 Base64 字符串解码并上传到 OSS
     * @param base64Data Base64 图片数据（可能带 data:image/png;base64, 前缀）
     * @param fileName 文件名（不含扩展名，会自动添加）
     * @return 上传后的文件访问 URL
     */
    public static byte[] uploadBase64ToOss(String base64Data, String fileName) {
        try {
            // 1. 去除前缀（如果有 data:image/png;base64,）
            if (base64Data != null && base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }

            // 2. Base64 解码为字节数组
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // 3. 生成唯一文件名
            String uniqueFileName = fileName + "_" + System.currentTimeMillis() + ".jpg";

            // 4. 上传到 MinIO（需要注入 OssService）
            // String url = ossService.uploadBytes(imageBytes, uniqueFileName);

            // 临时返回文件名
            return imageBytes;

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Base64 解码失败: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("图片上传失败: " + e.getMessage());
        }
    }
}