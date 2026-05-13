package chat.chatcontent.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommentDTO {

    private Integer code;
    private String message;
    private List<Integer> data;
}
