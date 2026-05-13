package chat.chatuser.service.Impl;


import chat.chatcommon.entity.User;
import chat.chatuser.mapper.UserMapper;
import chat.chatuser.pojo.dto.UserDTO;
import chat.chatuser.pojo.vo.UserVO;
import chat.chatuser.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<User> selectAll() {
        return userMapper.selectAll();
    }


    @Override
    public UserDTO login(UserDTO user){
        return userMapper.login(user);
    }

    @Override
    public int registerUser(UserDTO user){
        List<User> users = userMapper.selectAll();
        for (User user1 : users){
            if (user1.getEmail().equals(user.getEmail())){
                return 0;
            }
        }
        return userMapper.registerUser(user);
    }

    @Override
    public int deleteByEmail(UserDTO user) {
        return userMapper.deleteByEmail(user.getEmail());
    }


    @Override
    public int updateUserSelective(UserDTO user){
        return userMapper.updateUserSelective(user);
    }
    @Override
    public int identifyByAdmin(int starus, String phone){
        return userMapper.identifyByAdmin(starus,phone);
    }

    // 统计方法实现
    @Override
    public int countAll() {
        return userMapper.countAll();
    }

    @Override
    public int countByStatus(int status) {
        return userMapper.countByStatus(status);
    }

    @Override
    public int countByRole(int role) {
        return 0;
    }


}
