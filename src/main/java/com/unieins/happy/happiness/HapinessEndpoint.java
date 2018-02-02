package com.unieins.happy.happiness;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.persistence.EntityNotFoundException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.users.User;
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import com.unieins.happy.Constants;
import com.unieins.happy.PMF;
import com.unieins.happy.project.Project;
import com.unieins.happy.project.Sprint;
import com.unieins.happy.teaching.TeachingTermEndpoint;
import com.unieins.happy.user.Authorization;
import com.unieins.happy.user.UserEndpoint;

@Api(
	name = "happiness",
	version = Constants.VERSION,
	namespace = @ApiNamespace(
		ownerDomain = "unieins.com",
		ownerName = "unieins.com",
		packagePath = "happy"))
public class HapinessEndpoint {

	/**
	 * This method lists entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * If the parameter projectId is null, then all entities for the specified treaching term are returned
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listHapiness", path = "happinessStats",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public List<Hapiness> listHapiness(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit,
			@Named("teachingTerm") Long teachingTerm,
			@Nullable @Named("projectId") Long projectId, 
			User user) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Hapiness> execute = null;
		List<Hapiness> happinessList = null;
		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Hapiness.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}
			
			TeachingTermEndpoint tte = new TeachingTermEndpoint();
			Sprint sprint = tte.getCurrentSprint(teachingTerm);
			
			String filterString = "";
			
			if (sprint != null){
				Integer sprintNumber = sprint.getSprintNumber();
				filterString += "sprint <= " + sprintNumber;
			}

			if (projectId != null){
				if (filterString.length() > 0) filterString += " && ";
				filterString += "projectId == " + projectId;
			}
			
			if (filterString.length() > 0) {
				query.setFilter(filterString);
			}
			

			UserEndpoint ue = new UserEndpoint();
			List<com.unieins.happy.user.User> projectMembers = ue.listUser(null, null, projectId, user);
			
			HashMap<String, String> userNames = new	HashMap<String,String>();
			for (com.unieins.happy.user.User member : projectMembers) {
				userNames.put(member.getId(), member.getGivenName() + " " + member.getSurName());
			}
			
			execute = (List<Hapiness>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			
			for (Hapiness obj : execute){
				// Set the correct current user name
				if (userNames.get(obj.getUserId()) != null){
					obj.setUserName(userNames.get(obj.getUserId()).toString());
				}
				
			}
			
			happinessList = new ArrayList<Hapiness>();
			
			if (!Authorization.isUserAdmin(user)){
				for (Hapiness hapiness : execute){
					Hapiness copy = new Hapiness();
					copy.setHappiness(hapiness.getHappiness());
					copy.setId(hapiness.getId());
					copy.setProjectId(hapiness.getProjectId());
					copy.setSprint(hapiness.getSprint());
					copy.setTeachingTermId(hapiness.getTeachingTermId());
					copy.setUserId(hapiness.getUserId());
					
					copy.setUserName(hapiness.getUserId());
					happinessList.add(copy);
				}
				
				
				return happinessList;
					
			}
		} finally {
			mgr.close();
		}
		
		return execute;
//
//		return CollectionResponse.<Hapiness> builder().setItems(happinessList)
//				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getHapiness")
	public Hapiness getHapiness(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		Hapiness hapiness = null;
		try {
			hapiness = mgr.getObjectById(Hapiness.class, id);
		} finally {
			mgr.close();
		}
		return hapiness;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param hapiness the entity to be inserted.
	 * @return The inserted entity.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "insertHapiness",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public Hapiness insertHapiness(@Named("happiness") Integer hapinessValue,@Named("projectID") Long projectId, @Named("userName") String userName , User user) throws UnauthorizedException {
		
		PersistenceManager mgr = getPersistenceManager();
		if (hapinessValue > 3) hapinessValue = 3;
		if (hapinessValue < -3) hapinessValue = -3;
		Project project = mgr.getObjectById(Project.class, projectId);
		
		Authorization.isUserProjectMember(user, project);
		
		//FIXME delete potentially existing data for this sprint and user
		Hapiness hapiness = new Hapiness();
		hapiness.setHappiness(hapinessValue);
		hapiness.setDatetime(new java.util.Date());
		hapiness.setUserId(user.getUserId());
		
		com.unieins.happy.user.User dbUser = (new UserEndpoint()).getCurrentUser(user);
		hapiness.setUserName(dbUser.getGivenName() + " " +dbUser.getSurName());
		hapiness.setProjectId(projectId);
		TeachingTermEndpoint tte = new TeachingTermEndpoint();
		
		
		
		Integer sprintNumber = tte.getCurrentSprint(project.getTeachingTerm()).getSprintNumber();
		hapiness.setSprint(sprintNumber ); //FIXME Teachingterm ID nicht konstant 2
		
		try {
			
			Query query = mgr.newQuery(Hapiness.class);
			query.setFilter("sprint == "+ sprintNumber + " && projectId == " +projectId + " && userId == '"+user.getUserId()+"'");
			query.deletePersistentAll();
		
			
			mgr.makePersistent(hapiness);
		} finally {
			mgr.close();
		}
		return hapiness;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param hapiness the entity to be updated.
	 * @return The updated entity.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "updateHapiness",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public Hapiness updateHapiness(Hapiness hapiness, User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsHapiness(hapiness)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(hapiness);
		} finally {
			mgr.close();
		}
		return hapiness;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "removeHapiness",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public void removeHapiness(@Named("id") Long id, User user) throws UnauthorizedException {

		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			Hapiness hapiness = mgr.getObjectById(Hapiness.class, id);
			mgr.deletePersistent(hapiness);
		} finally {
			mgr.close();
		}
	}

	private boolean containsHapiness(Hapiness hapiness) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Hapiness.class, hapiness.getId());
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
