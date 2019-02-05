package com.unieins.happy.project;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
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
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import org.json.JSONException;
import com.unieins.happy.Constants;
import com.unieins.happy.Credentials;
import com.unieins.happy.PMF;
import com.unieins.happy.Sendgrid;
import com.unieins.happy.teaching.TeachingTerm;
import com.unieins.happy.teaching.TeachingTermEndpoint;
import com.unieins.happy.user.Authorization;
import com.unieins.happy.user.User;
import com.unieins.happy.user.UserEndpoint;


@Api(
	name = "happiness",
	version = Constants.VERSION,
	namespace = @ApiNamespace(
		ownerDomain = "unieins.com",
		ownerName = "unieins.com",
		packagePath = "happy"))
public class StandupEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listStandup", scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public List<StandupStats> listStandup(
			@Named("projectID") Long projectID,
			@Named("teachingTerm") Long teachingTerm,
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit,
			com.google.appengine.api.users.User user) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Standup> execute = null;

		List<StandupStats> statsList = new ArrayList<StandupStats>();

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Standup.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			query.setFilter("projectId == "+ projectID);

			execute = (List<Standup>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();




			UserEndpoint ue = new UserEndpoint();

			List<User> projectMembers = ue.listUser(null, null, projectID, user);

			TeachingTermEndpoint tte = new TeachingTermEndpoint();
			Integer sprintNumber = tte.getCurrentSprint(teachingTerm).getSprintNumber();



			for (int i = 1; i <= sprintNumber; i++) {
				HashMap<String, Integer> standupCount = new HashMap<String, Integer>();

				// Initialize for all project members (some may not have submitted any standup emails, those will remain 0.
				for (User projectMember : projectMembers) {
					standupCount.put(projectMember.getId(), 0);
				}

				// count number of standup emails
				for (Standup standup : execute){
					if (standup.getSprintNumber() != null && standup.getSprintNumber() == i && standup.getUserId() != null){
						Integer oldCount = standupCount.get(standup.getUserId());
						if (oldCount == null) oldCount =0;
						standupCount.put(standup.getUserId(), oldCount + 1);
					}
				}

				StandupStats stats = new StandupStats();
				stats.setSprintNumber(i);

				for (User projectMember : projectMembers) {
					Integer usersStandupCount = standupCount.get(projectMember.getId());

					stats.addStandupStat(projectMember.getId(), projectMember.getGivenName() + " " + projectMember.getSurName(), usersStandupCount);
				}

				statsList.add(stats);

			}

		} finally {
			mgr.close();
		}

		return statsList;
	}

	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listStandupMessages",  path = "standupList", scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public List<Standup> listStandupMessages(
			@Named("projectID") Long projectID,
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit,
			com.google.appengine.api.users.User user) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<Standup> execute = null;


		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(Standup.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			query.setFilter("projectId == "+ projectID);

			execute = (List<Standup>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();


		} finally {
			mgr.close();
		}

		return execute;
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getStandup")
	public Standup getStandup(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		Standup standup = null;
		try {
			standup = mgr.getObjectById(Standup.class, id);
		} finally {
			mgr.close();
		}
		return standup;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param standup the entity to be inserted.
	 * @return The inserted entity.
	 * @throws MessagingException
	 * @throws UnsupportedEncodingException
	 * @throws JSONException
	 * @throws UnauthorizedException
	 */
	@ApiMethod(name = "insertStandup",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public Standup insertStandup(Standup standup, com.google.appengine.api.users.User user) throws UnsupportedEncodingException, MessagingException, JSONException, UnauthorizedException {

		Project project = (new ProjectEndpoint()).getProject(standup.getProjectId(), user);

		Authorization.isUserProjectMember(user, project);



		PersistenceManager mgr = getPersistenceManager();
		try {
			if ((standup.getId() != null) && containsStandup(standup)) {
				throw new EntityExistsException("Object already exists");
			}

			com.unieins.happy.user.User u1User = mgr.getObjectById(com.unieins.happy.user.User.class, user.getUserId());
			standup.setUserId(user.getUserId());
			standup.setUserName(u1User.getGivenName() + " " + u1User.getSurName());
			sendStandupEmail(standup, user);

			mgr.makePersistent(standup);
		} finally {
			mgr.close();
		}
		return standup;
	}

	public void sendStandupEmail(Standup standup, com.google.appengine.api.users.User user) throws UnsupportedEncodingException, MessagingException, JSONException{

		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);

		String msgBody = "Hi Team,<br>";
		msgBody += "<p>";
		msgBody +="<strong>I've done the following:</strong><br>";
		msgBody += standup.getDone();
		msgBody += "</p>";

		msgBody += "<p>";
		msgBody +="<strong>What I'm planing:</strong><br>";
		msgBody += standup.getPlan();
		msgBody += "</p>";

		msgBody += "<p>";
		msgBody +="<strong>These are my current challenges:</strong><br>";
		msgBody += standup.getChallenges();
		msgBody += "</p>";

		msgBody += "Aloha,<br>";
		msgBody += (new UserEndpoint()).getCurrentUser(user).getGivenName();

		Sendgrid mail = new Sendgrid(Credentials.SENDGRID_USER ,Credentials.SENDGRID_PW);
		ProjectEndpoint pe = new ProjectEndpoint();
		Project project = pe.getProject(standup.getProjectId(), user);

		TeachingTermEndpoint tte = new TeachingTermEndpoint();
		TeachingTerm teachingTerm = tte.getTeachingTerm(project.getTeachingTerm());


		 // FIXME project number
		mail.setTo(teachingTerm.getStandupArchiveEmail()).setFrom(user.getEmail()).setSubject("[AMOS Team "+project.getName()+"] Standup-Email " + standup.getUserName()).setText(" ").setHtml(msgBody);

		List<User> userList = getProjectMembers(standup.getProjectId(), user);

		for (User projectMember : userList) {
			Logger.getLogger("logger").log(Level.INFO, "adding " +  projectMember.getEmail());
			String fullName = projectMember.getGivenName() + " " + projectMember.getSurName();
			// FIXME remove non-ascii characters from name
			// fullName = fullName.replaceAll("ae", "ae").replaceAll("ae", "oe").replaceAll("ae", "ue");
			mail.addTo(projectMember.getEmail()); // FIXME add name, but ASCII only
		}

		mail.send();
		Logger.getLogger("logger").log(Level.INFO,   mail.getServerResponse());
	}

	private List<User> getProjectMembers(Long projectID, com.google.appengine.api.users.User user){
		UserEndpoint userEndpoint = new UserEndpoint();
		return userEndpoint.listUser(null, null, projectID, user);
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param standup the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateStandup")
	public Standup updateStandup(Standup standup) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsStandup(standup)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(standup);
		} finally {
			mgr.close();
		}
		return standup;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeStandup")
	public void removeStandup(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			Standup standup = mgr.getObjectById(Standup.class, id);
			mgr.deletePersistent(standup);
		} finally {
			mgr.close();
		}
	}

	private boolean containsStandup(Standup standup) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(Standup.class, standup.getId());
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
