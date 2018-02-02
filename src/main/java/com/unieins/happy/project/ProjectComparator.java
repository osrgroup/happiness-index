package com.unieins.happy.project;

import java.util.Comparator;

public class ProjectComparator implements Comparator<Project> {
	@Override
	public int compare(Project p1, Project p2) {
		return p1.getName().compareTo(p2.getName());
	}
}