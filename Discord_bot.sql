-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2023-03-12 22:37:53.518

-- tables
-- Table: Deck
CREATE TABLE Deck (
    Deck_ID bigint NOT NULL AUTO_INCREMENT,
    Deck_Link varchar(255) NOT NULL,
    User_Discord_ID varchar(255) NOT NULL,
    Deck_Name varchar(255) NOT NULL,
    CONSTRAINT Deck_pk PRIMARY KEY (Deck_ID)
);

-- Table: Deck_Game
CREATE TABLE Deck_Game (
    Deck_Game_ID bigint NOT NULL AUTO_INCREMENT,
    Game_Game_ID bigint NOT NULL,
    Deck_1_Deck_ID bigint NOT NULL,
    Deck_2_Deck_ID bigint NOT NULL,
    Deck_3_Deck_ID bigint NOT NULL,
    Deck_4_Deck_ID bigint NOT NULL,
    Winner bigint NOT NULL,
    Discord_Channel_ID varchar(255) NOT NULL,
    CONSTRAINT Deck_Game_pk PRIMARY KEY (Deck_Game_ID)
);

-- Table: Deck_Stats
CREATE TABLE Deck_Stats (
    Deck_Stats_ID bigint NOT NULL AUTO_INCREMENT,
    Deck_Deck_ID bigint NOT NULL,
    Wins int NOT NULL,
    Loses int NOT NULL,
    Games int NOT NULL,
    Selected bool NOT NULL,
    Discord_Channel_ID varchar(255) NOT NULL,
    CONSTRAINT Deck_Stats_pk PRIMARY KEY (Deck_Stats_ID)
);

-- Table: Game
CREATE TABLE Game (
    Game_ID bigint NOT NULL AUTO_INCREMENT,
    Date date NOT NULL,
    CONSTRAINT Game_pk PRIMARY KEY (Game_ID)
);

-- Table: User
CREATE TABLE User (
    Discord_ID varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    CONSTRAINT User_pk PRIMARY KEY (Discord_ID)
);

-- foreign keys
-- Reference: Deck_Game_Deck_1 (table: Deck_Game)
ALTER TABLE Deck_Game ADD CONSTRAINT Deck_Game_Deck_1 FOREIGN KEY Deck_Game_Deck_1 (Deck_2_Deck_ID)
    REFERENCES Deck (Deck_ID);

-- Reference: Deck_Game_Deck_2 (table: Deck_Game)
ALTER TABLE Deck_Game ADD CONSTRAINT Deck_Game_Deck_2 FOREIGN KEY Deck_Game_Deck_2 (Deck_1_Deck_ID)
    REFERENCES Deck (Deck_ID);

-- Reference: Deck_Game_Deck_3 (table: Deck_Game)
ALTER TABLE Deck_Game ADD CONSTRAINT Deck_Game_Deck_3 FOREIGN KEY Deck_Game_Deck_3 (Deck_3_Deck_ID)
    REFERENCES Deck (Deck_ID);

-- Reference: Deck_Game_Deck_4 (table: Deck_Game)
ALTER TABLE Deck_Game ADD CONSTRAINT Deck_Game_Deck_4 FOREIGN KEY Deck_Game_Deck_4 (Deck_4_Deck_ID)
    REFERENCES Deck (Deck_ID);

-- Reference: Deck_Game_Game (table: Deck_Game)
ALTER TABLE Deck_Game ADD CONSTRAINT Deck_Game_Game FOREIGN KEY Deck_Game_Game (Game_Game_ID)
    REFERENCES Game (Game_ID);

-- Reference: Deck_Stats_Deck (table: Deck_Stats)
ALTER TABLE Deck_Stats ADD CONSTRAINT Deck_Stats_Deck FOREIGN KEY Deck_Stats_Deck (Deck_Deck_ID)
    REFERENCES Deck (Deck_ID);

-- Reference: Deck_User (table: Deck)
ALTER TABLE Deck ADD CONSTRAINT Deck_User FOREIGN KEY Deck_User (User_Discord_ID)
    REFERENCES User (Discord_ID);

-- End of file.

