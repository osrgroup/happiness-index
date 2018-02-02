package com.unieins.happy.teaching;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.users.User;
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import com.unieins.happy.Constants;
import com.unieins.happy.PMF;
import com.unieins.happy.project.Project;
import com.unieins.happy.project.ProjectEndpoint;
import com.unieins.happy.project.Sprint;
import com.unieins.happy.user.Authorization;

@Api(
	name = "happiness",
	version = Constants.VERSION,
	namespace = @ApiNamespace(
		ownerDomain = "unieins.com",
		ownerName = "unieins.com",
		packagePath = "happy"))
public class TeachingTermEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 * @throws UnauthorizedException 
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listTeachingTerm",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public CollectionResponse<TeachingTerm> listTeachingTerm(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit,
			User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<TeachingTerm> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(TeachingTerm.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<TeachingTerm>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (TeachingTerm obj : execute);
				
		} finally {
			mgr.close();
		}

		return CollectionResponse.<TeachingTerm> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param termId the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	//FIXME continue
	@ApiMethod(name = "getCurrentSprint", path="sprint")
	public Sprint getCurrentSprint(@Named("teachingTerm") Long termId) {
		PersistenceManager mgr = getPersistenceManager();
		TeachingTerm teachingterm = null;
		Sprint currentSprint = null;
		try {
			teachingterm = mgr.getObjectById(TeachingTerm.class, termId);
			if (teachingterm == null) return null;
			List<Sprint> sprints = teachingterm.getSprints();
			for (Sprint sprint : sprints) {
				if (currentSprint == null  || currentSprint.getDeadline().before(new Date())) currentSprint = sprint;
				if (sprint.getDeadline().after(new Date()) && (sprint.getDeadline().before(currentSprint.getDeadline())))currentSprint = sprint;
			}
		} finally {
			mgr.close();
		}
		if (currentSprint != null) currentSprint.getDeadline();
		return currentSprint;
	}
	
	
	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getTeachingTerm")
	public TeachingTerm getTeachingTerm(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		TeachingTerm teachingterm = null;
		try {
			teachingterm = mgr.getObjectById(TeachingTerm.class, id);
			List<Sprint> sprints = teachingterm.getSprints();
			
			for (Sprint sprint : sprints) {
				sprint.getDeadline();
			}
			
		} finally {
			mgr.close();
		}
		return teachingterm;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param teachingterm the entity to be inserted.
	 * @return The inserted entity.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "insertTeachingTerm",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public TeachingTerm insertTeachingTerm(TeachingTerm teachingterm, User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (teachingterm.getId() != null && containsTeachingTerm(teachingterm)) {
				throw new EntityExistsException("Object already exists");
			}
			mgr.makePersistent(teachingterm);
		} finally {
			mgr.close();
		}
		return teachingterm;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param teachingterm the entity to be updated.
	 * @return The updated entity.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "updateTeachingTerm",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public TeachingTerm updateTeachingTerm(TeachingTerm teachingterm, User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsTeachingTerm(teachingterm)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(teachingterm);
		} finally {
			mgr.close();
		}
		return teachingterm;
	}
	
	@ApiMethod(name = "editTeachingTerm",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public TeachingTerm editTeachingTerm(@Named("id") Long id, @Named("label") String label, @Named("standupArchiveEmail") String emailArchive, User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		TeachingTerm teachingterm;
		try {
			teachingterm = mgr.getObjectById(TeachingTerm.class, id);
			teachingterm.setLabel(label);
			teachingterm.setStandupArchiveEmail(emailArchive);
			mgr.makePersistent(teachingterm);
		} finally {
			mgr.close();
		}
		return teachingterm;
	}
	
	@ApiMethod(name = "teachingTerm.setJoinable", scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public TeachingTerm setJoinable(@Named("id") Long id, @Named("joinable") Boolean joinable, User user) throws UnauthorizedException {
		
		Authorization.restrictToAdmin(user);
		
		PersistenceManager mgr = getPersistenceManager();
		TeachingTerm teachingterm;
		try {
			teachingterm = mgr.getObjectById(TeachingTerm.class, id);
			teachingterm.setJoinable(joinable);
			mgr.makePersistent(teachingterm);
		} finally {
			mgr.close();
		}
		return teachingterm;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @throws UnauthorizedException 
	 */
	@ApiMethod(name = "removeTeachingTerm",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID, 
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public void removeTeachingTerm(@Named("id") Long id, User user) throws UnauthorizedException {
		PersistenceManager mgr = getPersistenceManager();
		try {
			
			Authorization.restrictToAdmin(user);
			
			TeachingTerm teachingterm = mgr.getObjectById(TeachingTerm.class, id);
			
			// Remove all projects within this teaching term
			ProjectEndpoint pe = new ProjectEndpoint();
			
			List<Project> projects = pe.listProject(null, null, id, user);
			
			for (Project project : projects) {
				pe.removeProject(project.getId(), user);
			}
			
			
			mgr.deletePersistent(teachingterm);
		} finally {
			mgr.close();
		}
	}

	private boolean containsTeachingTerm(TeachingTerm teachingterm) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(TeachingTerm.class, teachingterm.getId());
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
