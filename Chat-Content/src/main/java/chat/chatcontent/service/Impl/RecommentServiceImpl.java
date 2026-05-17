package chat.chatcontent.service.Impl;

import chat.chatcontent.mapper.ContentMapper;
import chat.chatcontent.pojo.dto.ContentDTO;
import chat.chatcontent.service.RecommentService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class RecommentServiceImpl implements RecommentService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private ContentMapper contentMapper;


    @PostConstruct
    public void initGlobalPool() {
        String globalKey = "ChatTree:";

        // 避免重复初始化
        if (Boolean.TRUE.equals(redisTemplate.hasKey(globalKey))) {
            return;
        }

        Set<String> keys = redisTemplate.keys(globalKey + "*");
        for (String key : keys) {
            if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
                continue;
            }
            redisTemplate.delete(key);
        }
        List<ContentDTO> contentDTOS = contentMapper.selectAllContent();

        for (ContentDTO contentDTO : contentDTOS){
            redisTemplate.opsForList().rightPush(globalKey+contentDTO.getEmail(), String.valueOf(contentDTO.getId()));
        }
        log.info("初始化全局推荐池...");
    }


    @Override
    public List<String> getData(ContentDTO contentDTO) {
        return redisTemplate.opsForList().range("ChatTree:"+contentDTO.getEmail()+":"+contentDTO.getId(), 0, -1);
    }

    @Override
    public int deleteData(ContentDTO contentDTO, Long value) {
        redisTemplate.opsForList().remove("ChatTree:"+contentDTO.getEmail()+":"+contentDTO.getId(), 0, String.valueOf(value));
        return 1;
    }

}
