package com.stackroute.recommendationservice.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDTO implements Serializable {
    private String username;
    private String name;
    private String email;
    private Date dateOfBirth;
    private List<String> newsPreferences;
    private String password;
    private Boolean isSub;
}
