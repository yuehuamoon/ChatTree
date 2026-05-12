package chat.chatgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "chat.chatgateway",    // 网关自己的包
        "chat.chatcommon"      // 公共模块包（JwtUtil所在）
})
public class ChatGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatGatewayApplication.class, args);
    }

}
