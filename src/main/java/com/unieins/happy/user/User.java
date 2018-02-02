package com.unieins.happy.user;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class User implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7106406386126680689L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	String id;
	
	@Persistent
	String givenName;
	@Persistent
	String surName;
	
	@Persistent
	String email;
	
	@Persistent
	List<Long> projects;
	
	@Persistent
	UserType type;
	
	@Persistent
	Long defaultTeachingTerm;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getGivenName() {
		return givenName;
	}
	
	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public String getSurName() {
		return surName;
	}

	public void setSurName(String surName) {
		this.surName = surName;
	}

	public List<Long> getProjects() {
		return projects;
	}

	public void setProjects(List<Long> projects) {
		this.projects = projects;
	}

	public void addProjectAuthorization(Long project){
		if (projects == null) projects = new ArrayList<Long>();
		projects.add(project);
	}
	
	public void removeProjectAuthorization(Long project){
		projects.remove(project);
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public UserType getType() {
		return type;
	}

	public void setType(UserType type) {
		this.type = type;
	}

	public Long getDefaultTeachingTerm() {
		return defaultTeachingTerm;
	}

	public void setDefaultTeachingTerm(Long defaultProject) {
		this.defaultTeachingTerm = defaultProject;
	}
	
}
