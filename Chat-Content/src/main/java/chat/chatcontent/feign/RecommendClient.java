package chat.chatcontent.feign;

import chat.chatcommon.dto.Result;
import chat.chatcontent.pojo.dto.ContentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "Chat-Recomment", path = "/")
public interface RecommendClient {

    @GetMapping("/recomment")
    Result<List<Integer>> getContentById();
}