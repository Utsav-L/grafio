package com.stackroute.recommendationservice.domain;

import lombok.*;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import java.util.Date;
import java.util.List;

@NodeEntity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class PostResp {
    @Id
    private Long id;
    private String title;
    private String videoUrl;
    private List<String> tags;
    @Relationship(type = "NEWS_LOCATION", direction = Relationship.OUTGOING)
    private Location location;
    @Relationship(type = "BelongsTo", direction = Relationship.OUTGOING)
    private SubCategory subCategory;
    private Date timestamp;
}
