package com.unieins.happy.happiness;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Hapiness {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	Long id;
	@Persistent
	Date datetime;
	@Persistent
	String userId;
	
	@Persistent
	String userName;
	
	@Persistent
	Integer sprint;
	
	@Persistent
	Long projectId;
	
	@Persistent
	Long teachingTermId;
	
	
	
	@Persistent
	Integer happiness;

	public Long getId() {
		return id;
	}
	
	public Date getDatetime() {
		return datetime;
	}

	public void setDatetime(Date datetime) {
		this.datetime = datetime;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Integer getHappiness() {
		return happiness;
	}

	public void setHappiness(Integer happiness) {
		this.happiness = happiness;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public Integer getSprint() {
		return sprint;
	}

	public void setSprint(Integer sprint) {
		this.sprint = sprint;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Long getTeachingTermId() {
		return teachingTermId;
	}

	public void setTeachingTermId(Long teachingTermId) {
		this.teachingTermId = teachingTermId;
	}
	
	
}
