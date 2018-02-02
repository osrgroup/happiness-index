package com.unieins.happy.project;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import org.json.JSONException;
import com.unieins.happy.Cache;
import com.unieins.happy.Constants;
import com.unieins.happy.Credentials;
import com.unieins.happy.PMF;
import com.unieins.happy.Sendgrid;
import com.unieins.happy.happiness.Hapiness;
import com.unieins.happy.happiness.HapinessEndpoint;
import com.unieins.happy.teaching.TeachingTerm;
import com.unieins.happy.user.Authorization;
import com.unieins.happy.user.UserEndpoint;

@Api(
	name = "happiness",
	version = Constants.VERSION,
	namespace = @ApiNamespace(
		ownerDomain = "unieins.com",
		ownerName = "unieins.com",
		packagePath = "happy"))
public class ProjectEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 * @throws UnauthorizedException 
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listProject" , path = "projectList",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public List<Project> listProject(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit,
			@Named("teachingTerm") Long teachingTerm, 
			User user) throws UnauthorizedException {

		String keyString = KeyFactory.createKeyString("ProjectList", teachingTerm);
		ArrayList<Project> projects = (ArrayList<Project>) Cache.get(keyString);

		if (projects == null) {
			PersistenceManager mgr = null;
			Cursor cursor = null;
			List<Project> execute = null;

			try {
				mgr = getPersistenceManager();
				Query query = mgr.newQuery(Project.class);
				if (cursorString != null && cursorString != "") {
					cursor = Cursor.fromWebSafeString(cursorString);
					HashMap<String, Object> extensionMap = new HashMap<String, Object>();
					extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
					query.setExtensions(extensionMap);
				}

				if (limit != null) {
					query.setRange(0, limit);
				}
				query.setFilter("teachingTerm == " + teachingTerm);
				execute = (List<Project>) query.execute();
				cursor = JDOCursorHelper.getCursor(execute);
				if (cursor != null) cursorString = cursor.toWebSafeString();

				// Tight loop for fetching all entities from datastore and accomodate
				// for lazy fetch.
				for (Project obj : execute);

				Collections.sort(execute, new ProjectComparator());

			} finally {
				mgr.close();
			}
			projects = new ArrayList<Project>(execute);
			Cache.cache(keyString, projects);
		}
		return projects;
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getProject")
	public Project getProject(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Project project = null;
		try {
			project = mgr.getObjectById(Project.class, id);
			project.getUsers();
		} finally {
			mgr.close();
		}
		return project;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param project the entity to be inserted.
	 * @return The inserted entity.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "insertProject",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public Project insertProject(Project project, User user ) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			if ((project.getId() != null) && containsProject(project)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.makePersistent(project);
			String keyString = KeyFactory.createKeyString("ProjectList", project.getTeachingTerm());
			Cache.invalidate(keyString);
		} finally {
			mgr.close();
		}
		return project;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param project the entity to be updated.
	 * @return The updated entity.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "updateProject",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public Project updateProject(Project project, User user ) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsProject(project)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(project);

			String keyString = KeyFactory.createKeyString("ProjectList", project.getTeachingTerm());
			Cache.invalidate(keyString);
		} finally {
			mgr.close();
		}
		return project;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "removeProject",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public void removeProject(@Named("id") Long id, User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			Project project = mgr.getObjectById(Project.class, id);
			
			// remove all happiness data for this project
			Query query = mgr.newQuery(Hapiness.class);
			HapinessEndpoint he = new HapinessEndpoint();
			List<Hapiness> happinessList = he.listHapiness(null, null, project.getTeachingTerm(), id, user);
			for (Hapiness happiness : happinessList) {
				he.removeHapiness(happiness.getId(), user);
			}
			
			//remove project from users list of projects
			List<String> memberList = project.getUsers();
			if (memberList != null){
				for (String userID : memberList) {
					com.unieins.happy.user.User member = mgr.getObjectById(com.unieins.happy.user.User.class, userID);
					member.removeProjectAuthorization(id);
					Cache.cache(member.getId(), com.unieins.happy.user.User.class, member);
					mgr.makePersistent(member);

				}
			}
			
			
			// remove actual project
			mgr.deletePersistent(project);
			String keyString = KeyFactory.createKeyString("ProjectList", project.getTeachingTerm());
			Cache.invalidate(keyString);
		} finally {
			mgr.close();
		}
	}
	
	@ApiMethod(name = "joinProject",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public void joinProject(@Named("id") Long id, User user) throws UnauthorizedException{
		PersistenceManager mgr = getPersistenceManager();

		Project project = mgr.getObjectById(Project.class, id);
		
		TeachingTerm term = mgr.getObjectById(TeachingTerm.class, project.getTeachingTerm());
		
		if (term.getJoinable()){
			com.unieins.happy.user.User dbuser = mgr.getObjectById(com.unieins.happy.user.User.class, user.getUserId());
			dbuser.addProjectAuthorization(project.getId());
			project.addUser(dbuser.getId());
			Cache.cache(user.getUserId(), com.unieins.happy.user.User.class, dbuser);
			mgr.makePersistent(dbuser);
		}
		else {
			throw new UnauthorizedException("Project not open for new users");
		}
	}
	
	@ApiMethod(name = "leaveProject",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public void leaveProject(@Named("projectID") Long projectID, @Named("userID") String userID, User user) throws UnauthorizedException{
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			Project project = mgr.getObjectById(Project.class, projectID);
			com.unieins.happy.user.User dbuser = mgr.getObjectById(com.unieins.happy.user.User.class, userID);
			
			project.removeUser(userID);
			dbuser.removeProjectAuthorization(projectID);

			Cache.cache(dbuser.getId(), com.unieins.happy.user.User.class, dbuser);
			mgr.makePersistent(dbuser);
			mgr.makePersistent(project);
		} finally {
			mgr.close();
		}
	}
	
	@ApiMethod(name = "sendTeamEmail",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
public void sendTeamEmail( @Named("subject") String subject, @Named("message") String message,  @Named("projectID") Long projectID, User user) throws UnsupportedEncodingException, MessagingException, JSONException{
		
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);

		
		Sendgrid mail = new Sendgrid(Credentials.SENDGRID_USER ,Credentials.SENDGRID_PW);
		
		 // FIXME project number
		mail.setFrom(user.getEmail()).setSubject(subject).setText(" ").setHtml(message);

		List<com.unieins.happy.user.User> userList = getProjectMembers(projectID, user);
		
		for (com.unieins.happy.user.User projectMember : userList) {
			Logger.getLogger("logger").log(Level.WARNING, "adding " +  projectMember.getEmail());
			String fullName = projectMember.getGivenName() + " " + projectMember.getSurName();
			// FIXME remove non-ascii characters from name
			// fullName = fullName.replaceAll("ae", "ae").replaceAll("oe", "oe").replaceAll("ue", "ue");
			mail.addTo(projectMember.getEmail(), fullName);
		}
		mail.addTo("oss-amos@group.riehle.org", "AMOS Teaching Team");
		mail.send();
		Logger.getLogger("logger").log(Level.WARNING,   mail.getServerResponse());
	}

private List<com.unieins.happy.user.User> getProjectMembers(Long projectID, com.google.appengine.api.users.User user){
	UserEndpoint userEndpoint = new UserEndpoint();
	return userEndpoint.listUser(null, null, projectID, user);
}

	private boolean containsProject(Project project) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Project.class, project.getId());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}

