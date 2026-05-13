package chat.chatuser.pojo.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
/**
 * 用户表(User)实体类
 *
 * @author makejava
 * @since 2026-05-12 17:51:15
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO implements Serializable {
    private static final long serialVersionUID = 205744483230361484L;
    /**
     * 邮箱（主键）
     */
    private String email;
    /**
     * 账号
     */
    private String username;
    /**
     * 昵称
     */
    private String nickname;
    /**
     * 密码
     */
    private String password;
    /**
     * 头像URL(MinIO)
     */
    private String avatar;
    private String avatarBase64;
    /**
     * 个人简介
     */
    private String intro;
    /**
     * 隐私设置：1公开 2仅好友 3私密
     */
    private Integer privacySetting;
    /**
     * 状态：1正常 2禁言 3封号
     */
    private Integer status;
    private Date createTime;
    private Date updateTime;
    private Integer isDeleted;
}
