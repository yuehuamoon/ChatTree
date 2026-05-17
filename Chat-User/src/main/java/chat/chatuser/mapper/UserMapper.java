package chat.chatuser.mapper;



import chat.chatcommon.entity.User;
import chat.chatuser.pojo.dto.UserDTO;
import chat.chatuser.pojo.vo.UserVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("select * from user")
    List<User> selectAll();

    @Select("select * from user limit #{page}, 10")
    List<User> selectByPage(Integer page);



    @Select("select * from user where email=#{user.email} and password=#{user.password}")
    UserDTO login(@Param("user") UserDTO user);



    /**
     * 注册用户（插入所有字段）
     * 注意：status 默认 1（正常），is_deleted 默认 0
     * create_time / update_time 使用数据库当前时间戳
     */
    @Insert("INSERT INTO user (email, username, nickname, password, avatar, intro, privacy_setting, status, is_deleted, create_time, update_time) " +
            "VALUES (#{email}, #{username}, #{nickname}, #{password}, #{avatar}, #{intro}, #{privacySetting}, 1, 0, NOW(), NOW())")
    int registerUser(UserDTO user);

    /**
     * 根据邮箱删除用户（物理删除，一般不建议，可根据业务改为逻辑删除）
     */
    @Delete("DELETE FROM user WHERE email = #{email}")
    int deleteByEmail(@Param("email") String email);

    /**
     * 动态更新用户信息（基于 email）
     */
    @Update({
            "<script>",
            "UPDATE user",
            "<set>",
            "   <if test='user.username != null and user.username != \"\"'>username = #{user.username},</if>",
            "   <if test='user.nickname != null and user.nickname != \"\"'>nickname = #{user.nickname},</if>",
            "   <if test='user.password != null and user.password != \"\"'>password = #{user.password},</if>",
            "   <if test='user.avatar != null and user.avatar != \"\"'>avatar = #{user.avatar},</if>",
            "   <if test='user.intro != null'>intro = #{user.intro},</if>",
            "   <if test='user.privacySetting != null'>privacy_setting = #{user.privacySetting},</if>",
            "   <if test='user.status != null'>status = #{user.status},</if>",
            "   update_time = NOW()",
            "</set>",
            "WHERE email = #{user.email}",
            "</script>"
    })
    int updateUserSelective(@Param("user") UserDTO user);

    /**
     * 管理员修改用户状态（根据 email）
     */
    @Update("UPDATE user SET status = #{status}, update_time = NOW() WHERE email = #{email}")
    int identifyByAdmin(@Param("status") int status, @Param("email") String email);

    // ========== 统计查询 ==========
    @Select("SELECT COUNT(*) FROM user")
    int countAll();

    @Select("SELECT COUNT(*) FROM user WHERE status = #{status}")
    int countByStatus(@Param("status") int status);

    // 注意：UserDTO 中没有 role 字段，如果你的表实际存在 role 列，可以取消注释并调整字段名
    // 若不存在 role 列，建议删除此方法。
    // @Select("SELECT COUNT(*) FROM user WHERE role = #{role}")
    // int countByRole(@Param("role") int role);

}
