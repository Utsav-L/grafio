package com.stackroute.recommendationservice.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.recommendationservice.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class RabbitMqReceiver {

    @Autowired
    QueryService queryService;

    public void receivePosts(String message) {
        PostDTO postDTO;
        User user;
        try {
            postDTO = new ObjectMapper().readValue(message, PostDTO.class);
            Post post = Post.builder()
                    .videoID(postDTO.getId())
                    .title(postDTO.getTitle())
                    .videoUrl(postDTO.getVideoUrl())
                    .subCategory(new SubCategory(postDTO.getCategory(), null, null))
                    .location(new Location(postDTO.getLocation(), null, null))
                    .timestamp(postDTO.getTimestamp())
                    .tags(postDTO.getTags())
                    .build();
            System.out.println(postDTO.toString());
            try {
                user = queryService.getUser(postDTO.getPostedBy());
            }
            catch (NullPointerException e) {
                //e.printStackTrace();
                System.out.println("User not found");
                return;
            }
            if(user == null) {
                return;
            }
            if(user.getPublishedPosts()!=null) {
                user.getPublishedPosts().add(post);
            } else {
                Set<Post> posts = new HashSet<>();
                posts.add(post);
                user.setPublishedPosts(posts);
            }
            try {
                queryService.removeFromLiked(postDTO.getId());
                for (String likedBy : postDTO.getLikedBy()) {
                    queryService.addToLiked(likedBy, postDTO.getId());
                }
            }
            catch (NullPointerException e) {
                //System.out.println("Post not liked yet");
                //e.printStackTrace();
            }
            try {
                for (String viewedBy : postDTO.getWatchedBy()) {
                    queryService.addToViewed(viewedBy, postDTO.getId());
                }
            }
            catch (NullPointerException e) {
                //System.out.println("Post not viewed yet");
                //e.printStackTrace();
            }
            try {
                for (String boughtBy : postDTO.getBoughtBy()) {
                    queryService.addToBought(boughtBy, postDTO.getId());
                }
            }
            catch (NullPointerException e) {
                //System.out.println("Post not viewed yet");
                //e.printStackTrace();
            }
            queryService.saveUser(user);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void receiveUsers(String message) {
        UserDTO userDTO = null;
        User user = null;
        try {
            System.out.println(message);
            userDTO = new ObjectMapper().readValue(message, UserDTO.class);

            user = User.builder()
                    .username(userDTO.getUsername())
                    .build();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            queryService.removeAgeGroupRel(userDTO.getUsername());
            Date dob = userDTO.getDateOfBirth();
            Calendar calendar = new GregorianCalendar();
            calendar.setTime(dob);
            int year = calendar.get(Calendar.YEAR);
            year = ((year+5)/10)*10;
            user.setAgeGroup(new AgeGroup(year));
        } catch (NullPointerException e) {
            //System.out.println("age not set");
        }
        Set<SubCategory> newsPreferences = new HashSet<>();
        try {
            queryService.removeNewsPrefRel(userDTO.getUsername());
            for(String pref: userDTO.getNewsPreferences()) {
                newsPreferences.add(new SubCategory(pref, null, null));
            }
            user.setNewsPreferences(newsPreferences);
        } catch (NullPointerException e) {
            //System.out.println("pref not set");
        }
        queryService.saveUser(user);
    }

}

