package chat.chatoss.service;

import chat.chatoss.config.OssConfig;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.UUID;

@Service
public class OssUploadService {

    @Resource
    private MinioClient minioClient;

    @Resource
    private OssConfig minioConfig;

    public String upload(String fileName, byte[] imageBytes) {
        try {
            // 1. 提取扩展名
            String suffix = "";
            if (fileName != null && fileName.contains(".")) {
                suffix = fileName.substring(fileName.lastIndexOf("."));
            } else {
                suffix = ".jpg";
            }

            // 2. 生成唯一文件名
            String uniqueFileName = UUID.randomUUID().toString().replace("-", "") + suffix;

            // 3. 上传到 MinIO
            try (ByteArrayInputStream inputStream = new ByteArrayInputStream(imageBytes)) {
                minioClient.putObject(PutObjectArgs.builder()
                        .bucket(minioConfig.getBucketName())
                        .object(uniqueFileName)
                        .stream(inputStream, imageBytes.length, -1)
                        .contentType(getContentType(suffix))
                        .build());
            }

            // 4. 返回图片 URL
            return minioConfig.getEndpoint() + "/" + minioConfig.getBucketName() + "/" + uniqueFileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("上传失败：" + e.getMessage());
        }
    }

    private String getContentType(String suffix) {
        switch (suffix.toLowerCase()) {
            case ".png": return "image/png";
            case ".gif": return "image/gif";
            case ".webp": return "image/webp";
            default: return "image/jpeg";
        }
    }
}