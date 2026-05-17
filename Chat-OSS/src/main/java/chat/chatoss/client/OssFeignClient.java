package chat.chatoss.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "Chat-OSS", path = "/oss")
public interface OssFeignClient {

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    String upload(@RequestParam("file") MultipartFile file);
}