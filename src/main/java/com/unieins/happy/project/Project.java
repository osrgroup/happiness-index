package com.unieins.happy.project;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Project implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = -8257815841457904953L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	Long id;

	@Persistent
	String name;

	@Persistent
	String description;

	@Persistent
	Long teachingTerm;

	Boolean userJoined;

	@Persistent
	List<String> users;

	@Persistent
	String managerID;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Boolean getUserJoined() {
		return userJoined;
	}

	public void setUserJoined(Boolean userJoined) {
		this.userJoined = userJoined;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getUsers() {
		return users;
	}

	public void setUsers(List<String> users) {
		this.users = users;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getTeachingTerm() {
		return teachingTerm;
	}

	public void setTeachingTerm(Long teachingTerm) {
		this.teachingTerm = teachingTerm;
	}

	public String getManagerID() {
		return managerID;
	}

	public void setManagerID(String managerID) {
		this.managerID = managerID;
	}

	public void addUser(String userID){
		if (users == null) users = new ArrayList<String>();
		if (users.contains(userID)) return;
		users.add(userID);
	}

	public void removeUser(String userID){
		if (users == null) users = new ArrayList<String>();
		if (users.contains(userID)) users.remove(userID);
	}
}
