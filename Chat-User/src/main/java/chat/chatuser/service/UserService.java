package chat.chatuser.service;

import chat.chatcommon.entity.User;
import chat.chatuser.pojo.dto.UserDTO;
import chat.chatuser.pojo.vo.UserVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    List<User> selectAll();

    int registerUser(UserDTO user);

    int deleteByEmail(UserDTO user);
    UserDTO login(UserDTO user);

    int updateUserSelective(UserDTO user);

    int identifyByAdmin(int starus, String phone);

    // 统计方法
    int countAll();
    int countByStatus(int status);
    int countByRole(int role);
}
