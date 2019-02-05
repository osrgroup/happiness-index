package com.unieins.happy.user;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

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
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import com.google.appengine.api.utils.SystemProperty;

import com.unieins.happy.Cache;
import com.unieins.happy.Constants;
import com.unieins.happy.PMF;

@Api(
	name = "happiness",
	version = Constants.VERSION,
	namespace = @ApiNamespace(
		ownerDomain = "unieins.com",
		ownerName = "unieins.com",
		packagePath = "happy"))
public class UserEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listUser",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public List<User> listUser(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit, @Named("projectID") Long projectID, com.google.appengine.api.users.User user) {

				//Set filter
				List<Long> idsToFilter = new ArrayList<Long>();
				idsToFilter.add(projectID);
				Filter filter = new FilterPredicate("projects", FilterOperator.IN, idsToFilter);

				DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

				com.google.appengine.api.datastore.Query q = new com.google.appengine.api.datastore.Query("User").setFilter(filter);

				PreparedQuery pq = datastore.prepare(q);

				Calendar cal = Calendar.getInstance();

				Map<String, Integer> freq = new HashMap<String, Integer>();

//				List<User> users = (List<User>)(List<?>)Lists.newArrayList(  pq.asIterable() );

				List<User> users = new ArrayList<User>();

				for (Entity result : pq.asIterable()) {
					User dbUser = new User();
					dbUser.setGivenName((String) result.getProperty("givenName"));
					dbUser.setSurName((String) result.getProperty("surName"));
					dbUser.setProjects((List<Long>) result.getProperty("projects"));
					dbUser.setId((String) result.getKey().getName());
					dbUser.setEmail((String) result.getProperty("email"));

					users.add(dbUser);
				}

				return users;
	}

	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listManager", path = "manager" ,  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public CollectionResponse<User> listManager(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit, com.google.appengine.api.users.User user) throws UnauthorizedException {

		Authorization.restrictToAdmin(user);

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<User> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(User.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			query.setFilter("type == 'MODERATOR'");

			execute = (List<User>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (User obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<User> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 * @throws UnauthorizedException
	 */
	@ApiMethod(name = "getUser", path = "getUser",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public User getUser(@Named("id") String id, com.google.appengine.api.users.User googleUser) throws UnauthorizedException {

		Authorization.restrictToAdmin(googleUser);

		PersistenceManager mgr = getPersistenceManager();
		User user = null;
		try {
			// user = mgr.getObjectById(User.class, id);
			user = (User) Cache.getOrLoad(id, com.unieins.happy.user.User.class);
		} finally {
			mgr.close();
		}
		return user;
	}


	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "findUser", path = "userlist",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public CollectionResponse<User> findUser(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit, @Named("searchString") String searchString, com.google.appengine.api.users.User user) throws UnauthorizedException {

		Authorization.restrictToAdmin(user);

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<User> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(User.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			query.setFilter("email == '"+searchString+"'");

			execute = (List<User>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (User obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<User> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getCurrentUser",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public User getCurrentUser(com.google.appengine.api.users.User user) {
		PersistenceManager mgr = getPersistenceManager();
		com.unieins.happy.user.User dbuser = null;
		try {
			dbuser = (User) Cache.getOrLoad(user.getUserId(), com.unieins.happy.user.User.class);
			// dbuser = mgr.getObjectById(User.class, user.getUserId());


		} finally {
			mgr.close();
		}
		return dbuser;
	}


	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param user the entity to be inserted.
	 * @return The inserted entity.
	 * @throws UnauthorizedException
	 */
	@ApiMethod(name = "insertUser",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public User insertUser(User dbuser, com.google.appengine.api.users.User user) throws UnauthorizedException {

		PersistenceManager mgr = getPersistenceManager();
		dbuser.setId(user.getUserId());
		dbuser.setType(UserType.USER);
		try {
			if (containsUser(dbuser)) {
				throw new EntityExistsException("Object already exists");
			}
			Cache.cache(user.getUserId(), com.unieins.happy.user.User.class, dbuser);
			mgr.makePersistent(dbuser);

		} finally {
			mgr.close();
		}
		return dbuser;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param user the entity to be updated.
	 * @return The updated entity.
	 * @throws UnauthorizedException
	 */
	@ApiMethod(name = "updateUser",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public User updateUser(User user, com.google.appengine.api.users.User googleUser) throws UnauthorizedException {

		Authorization.restrictToAdmin(googleUser);

		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsUser(user)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			Cache.cache(user.getId(), com.unieins.happy.user.User.class, user);
			mgr.makePersistent(user);
		} finally {
			mgr.close();
		}
		return user;
	}

	@ApiMethod(name = "updateUserType",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public User updateUserType(@Named("id") String id, @Named("type") String type, com.google.appengine.api.users.User loggedInUser) throws UnauthorizedException {
		PersistenceManager mgr = getPersistenceManager();
		User user = null;
		try {

			user = (User) Cache.getOrLoad(id, User.class);

			// only admins are allowed to trigger this endpoint
			if(!Authorization.isUserAdmin(loggedInUser)) {
				if (SystemProperty.environment.value().equals(SystemProperty.Environment.Value.Development)) {
					// in dev environmanet everyone may use this endpoint.
					Logger.getLogger("logger").log(Level.INFO, "UpdateUserType called by non-admin user. Allowed because Dev Environment!");
				} else {
					throw new UnauthorizedException("Only Admins are allowed.");
				}
			}

			switch (type) {
				case "ADMIN":
					user.setType(UserType.ADMIN);
					break;
				case "USER":
					user.setType(UserType.USER);
					break;
				default:
					break;
			}

			mgr.makePersistent(user);
			Cache.cache(id, User.class, user);

		} finally {
			mgr.close();
		}
		return user;
	}


	@ApiMethod(name = "setDefaultTeachingTerm",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public User setDefaultTeachingTerm(@Named("defaultTeachingTerm") Long defaultTeachingTerm, com.google.appengine.api.users.User user) throws UnauthorizedException {
		PersistenceManager mgr = getPersistenceManager();

		com.unieins.happy.user.User dbuser = null;
		try {
			// dbuser = mgr.getObjectById(User.class, user.getUserId());
			dbuser = (User) Cache.getOrLoad(user.getUserId(), com.unieins.happy.user.User.class);
			dbuser.setDefaultTeachingTerm(defaultTeachingTerm);
			mgr.makePersistent(dbuser);
			Cache.cache(user.getUserId(), com.unieins.happy.user.User.class, dbuser);
		} finally {
			mgr.close();
		}
		return dbuser;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 * @throws UnauthorizedException
	 */
	@ApiMethod(name = "removeUser",  scopes = {Constants.EMAIL_SCOPE},
			clientIds = {Constants.WEB_CLIENT_ID,
		     com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID},
		     audiences = {Constants.WEB_CLIENT_ID})
	public void removeUser(@Named("id") String id, com.google.appengine.api.users.User googleUser) throws UnauthorizedException {

		Authorization.restrictToAdmin(googleUser);

		PersistenceManager mgr = getPersistenceManager();
		try {
			// User user = mgr.getObjectById(User.class, id);
			User user = (User) Cache.getOrLoad(id, com.unieins.happy.user.User.class);
			mgr.deletePersistent(user);
			Cache.invalidate(googleUser.getUserId(), com.unieins.happy.user.User.class);
		} finally {
			mgr.close();
		}
	}

	private boolean containsUser(User user) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(User.class, user.getId());
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
