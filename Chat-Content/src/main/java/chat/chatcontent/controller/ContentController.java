package chat.chatcontent.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/content")
public class ContentController {

    @GetMapping("/hello")
    public String hello() {
        return "user-service is running";
    }

    @GetMapping("/info/{id}")
    public Map<String, Object> getUser(@PathVariable Long id) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", id);
        user.put("name", "test-user-" + id);
        user.put("age", 18);
        return user;
    }

    @PostMapping("/create")
    public Map<String, Object> createUser(@RequestBody Map<String, Object> req) {
        req.put("status", "created");
        return req;
    }
}
