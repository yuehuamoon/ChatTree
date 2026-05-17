package chat.chatcontent;

import chat.chatcontent.pojo.dto.ContentDTO;
import chat.chatcontent.service.Impl.ContentServiceImpl;
import chat.chatcontent.service.Impl.RecommentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
@SpringBootTest
class ChatContentApplicationTests {


    @Autowired
    private RecommentServiceImpl recommendService;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private ContentServiceImpl contentService;



    @Test
    public void testGetData(){
        ContentDTO contentDTO = new ContentDTO();
        Long id = 9L;
        contentDTO.setId(id);
        contentDTO.setEmail("1@qq.com");
        List<String> str = recommendService.getData(contentDTO);
        if (str.size() <= 0){
            System.out.println("null");
            redisTemplate.opsForList().remove("ChatTree:"+"1@qq.com", 0, String.valueOf(contentDTO.getId()));
        }
        System.out.println(str);
    }

    @Test
    public void testGetData2(){
        ContentDTO contentDTO = new ContentDTO();
        Long id = 9L;
        contentDTO.setId(id);
        contentDTO.setEmail("1@qq.com");

        List<ContentDTO> contentDTOS = contentService.getRecommend(contentDTO);
        for (ContentDTO contentDTO2 : contentDTOS) {
            System.out.println(contentDTO2);

        }

    }



}
