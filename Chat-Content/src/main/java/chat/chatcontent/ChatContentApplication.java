package chat.chatcontent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "chat.chatcommon",
        "chat.chatcontent",
        "chat.chatoss"
})
@EnableFeignClients(basePackages = {"chat.chatcommon.feign", "chat.chatcontent.feign"})
public class ChatContentApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatContentApplication.class, args);
    }

}
