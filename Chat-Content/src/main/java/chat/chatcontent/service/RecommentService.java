package chat.chatcontent.service;


import chat.chatcontent.pojo.dto.ContentDTO;

import java.util.List;

public interface RecommentService {

    List<String> getData(ContentDTO contentDTO);

    int deleteData(ContentDTO contentDTO, Long value);
}
