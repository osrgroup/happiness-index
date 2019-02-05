package com.unieins.happy.teaching;

import java.util.List;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.unieins.happy.project.Sprint;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class TeachingTerm {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	Long id;

	@Persistent
	String label;

	@Persistent
	String standupArchiveEmail;

	@Persistent
	String institution;

	@Persistent
	@Element(dependent = "true")
	List<Sprint> sprintDeadlines;

	@Persistent
	Boolean joinable;

	@Persistent
	Boolean archived;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Sprint> getSprints() {
		return sprintDeadlines;
	}

	public void setSprints(List<Sprint> sprintDeadlines) {
		this.sprintDeadlines = sprintDeadlines;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public Boolean getJoinable() {
		return joinable;
	}

	public void setJoinable(Boolean joinable) {
		this.joinable = joinable;
	}

	public Boolean getArchived() {
		return archived;
	}

	public void setArchived(Boolean archived) {
		this.archived = archived;
	}

	public String getInstitution() {
		return institution;
	}

	public void setInstitution(String institution) {
		this.institution = institution;
	}

	public String getStandupArchiveEmail() {
		return standupArchiveEmail;
	}

	public void setStandupArchiveEmail(String standupArchiveEmail) {
		this.standupArchiveEmail = standupArchiveEmail;
	}


}
