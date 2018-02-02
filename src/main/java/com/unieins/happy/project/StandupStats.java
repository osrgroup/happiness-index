package com.unieins.happy.project;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class StandupStats {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	Long id;

	@Persistent
	Integer sprintNumber;
	
	@Persistent
	List<String> userId =  new ArrayList<String>();
	
	@Persistent
	List<String> userName = new ArrayList<String>();
	
	@Persistent
	List<Integer> StandupCount = new ArrayList<Integer>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getSprintNumber() {
		return sprintNumber;
	}

	public void setSprintNumber(Integer sprintNumber) {
		this.sprintNumber = sprintNumber;
	}

	public List<String> getUserId() {
		return userId;
	}

	public void setUserId(List<String> userId) {
		this.userId = userId;
	}

	public List<String> getUserName() {
		return userName;
	}

	public void setUserName(List<String> userName) {
		this.userName = userName;
	}

	public List<Integer> getStandupCount() {
		return StandupCount;
	}

	public void setStandupCount(List<Integer> standupCount) {
		StandupCount = standupCount;
	}
	
	public void addStandupStat(String userID, String userName, Integer standupCount){
		StandupCount.add(standupCount);
		this.userName.add(userName);
		this.userId.add(userID);
	}
	
}
