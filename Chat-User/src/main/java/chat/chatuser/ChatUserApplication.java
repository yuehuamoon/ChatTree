package chat.chatuser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "chat.chatcommon",
        "chat.chatuser",
        "chat.chatoss"
})
@EnableFeignClients(basePackages = {"chat.chatoss.client", "chat.chatuser"})
public class ChatUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatUserApplication.class, args);
    }

}
