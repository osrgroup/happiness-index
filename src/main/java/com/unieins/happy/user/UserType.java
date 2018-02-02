package com.unieins.happy.user;

public enum UserType {
	USER(1),MODERATOR(2),ADMIN(3);

	private final int value;
    private UserType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
