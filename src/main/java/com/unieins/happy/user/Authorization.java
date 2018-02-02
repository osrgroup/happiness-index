package com.unieins.happy.user;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.unieins.happy.PMF;
import com.unieins.happy.project.Project;

public class Authorization {
	
	public static Boolean isUserProjectMember(User googleUser, Project project) throws UnauthorizedException {
		//PersistenceManager mgr = getPersistenceManager();
		if (googleUser == null){
			throw new UnauthorizedException("User not logged in");
		}
		Logger.getLogger("logger").log(Level.INFO,   "Checking if user is project member. User " + googleUser.getUserId());
		Logger.getLogger("logger").log(Level.INFO, "Project is " + project.getId());
		Logger.getLogger("logger").log(Level.INFO, "Project Users are is " + project.getUsers());
		if (project.getUsers().contains(googleUser.getUserId())) return true;
		else  throw new UnauthorizedException("User is Not Authorized");

	}
	
	
	public static void restrictToAdmin(User googleUser) throws UnauthorizedException{
		
		if (!isUserAdmin(googleUser)) throw new UnauthorizedException("User is Not Authorized");
	}
	
	public static Boolean isUserAdmin(User googleUser) {
		PersistenceManager mgr = getPersistenceManager();
		com.unieins.happy.user.User u1User = mgr.getObjectById(com.unieins.happy.user.User.class, googleUser.getUserId());
		UserType u1UserType = u1User.getType();
//		return true;
		if (u1UserType == UserType.ADMIN){
			return true;
		}
		else return false;
	}
	
	

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}
}
