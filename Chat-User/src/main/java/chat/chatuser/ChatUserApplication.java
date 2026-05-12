package chat.chatuser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "chat.chatcommon"      // 公共模块包（JwtUtil所在）
})
public class ChatUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatUserApplication.class, args);
    }

}
