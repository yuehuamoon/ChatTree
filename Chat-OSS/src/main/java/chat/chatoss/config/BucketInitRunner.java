package chat.chatoss.config;

import io.minio.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class BucketInitRunner implements CommandLineRunner {

    private final MinioClient minioClient;
    private final OssConfig ossConfig;

    public BucketInitRunner(MinioClient minioClient, OssConfig ossConfig) {
        this.minioClient = minioClient;
        this.ossConfig = ossConfig;
    }

    @Override
    public void run(String... args) throws Exception {
        String bucket = ossConfig.getBucketName();

        // 1. 不存在就创建桶
        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            System.out.println("✅ 桶已创建：" + bucket);
        }

        // ====================== ✅ 核心：JAVA 代码自动开公共读权限 ======================
        String policy = """
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": ["s3:GetObject"],
                        "Resource": ["arn:aws:s3:::%s/*"]
                    }
                ]
            }
            """.formatted(bucket);

        minioClient.setBucketPolicy(
                SetBucketPolicyArgs.builder()
                        .bucket(bucket)
                        .config(policy)
                        .build()
        );

        System.out.println("✅ 桶权限已设置为：公共读（图片可直接访问）");
    }
}