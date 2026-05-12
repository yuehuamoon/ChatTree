package chat.chatuser.controller;

import chat.chatcommon.dto.Page;
import chat.chatuser.pojo.dto.UserDTO;
import chat.chatcommon.util.JwtUtil;
import chat.chatuser.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import chat.chatcommon.dto.Result;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;  // 假设 UserService 已适配 UserDTO

    @PostMapping("/login")
    public Result login(@RequestBody UserDTO user) {
        UserDTO userDTO = userService.login(user);
        if (userDTO != null) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("email", userDTO.getEmail());
            claims.put("username", userDTO.getUsername());
            claims.put("nickname", userDTO.getNickname());
            claims.put("avatar", userDTO.getAvatar());
            claims.put("status", userDTO.getStatus());
            return Result.success(jwtUtil.genJwt(claims));
        }
        return Result.error("用户名或密码错误");
    }

    @PostMapping("/register")
    public Result register(@RequestBody UserDTO userDTO) {
        try {

            int result = userService.registerUser(userDTO);
            if (result == 1) {
                return Result.success("注册成功");
            } else {
                return Result.error(400, "注册失败：数据库插入无影响行数");
            }
        } catch (Exception e) {
            log.error("用户注册接口异常", e);
            String errorMsg = e.getMessage() == null ? e.getClass().getName() : e.getMessage();
            return Result.error(500, "注册失败：" + errorMsg);
        }
    }

    @PostMapping("/delete")
    public Result deleteEmail(@RequestBody UserDTO user) {
        if (user.getEmail() != null) {
            int msg = userService.deleteByEmail(user);
            return Result.success(msg);
        }
        return Result.error("未登录");
    }

    @PostMapping("/update")
    public Result updateUser(@RequestBody UserDTO user) {
        if (user.getEmail() != null) {
            int msg = userService.updateUserSelective(user);
            return Result.success(msg);
        }
        return Result.error("未登录");
    }

    @PostMapping("/identify")
    public Result identify(@RequestBody UserDTO user) {
        if (user.getEmail() != null) {
            return Result.success(userService.identifyByAdmin(user.getStatus(), user.getEmail()));
        }
        return Result.error("缺少邮箱");
    }


    @GetMapping("/count")
    public Result<Map<String, Object>> count() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", userService.countAll());
        stats.put("active", userService.countByStatus(1));
        stats.put("banned", userService.countByStatus(0));
        stats.put("admin", userService.countByRole(1));
        stats.put("normal", userService.countByRole(2));
        return Result.success(stats);
    }
}