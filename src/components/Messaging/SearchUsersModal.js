import React, { useState } from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBFormInline,
  MDBIcon
} from "mdbreact";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import { firestore } from "../../config/fbConfig.js";
import blank_user from "../../assets/img/blank_user.png";

const SearchUsersModal = props => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchParticipants = async searchTerm => {
    let searchArray = [];
    const usersRef = firestore.collection("users");
    await usersRef
      .where("fullName", "==", searchTerm)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          searchArray.push(doc.data());
        });
      });
    setSearchResults(searchArray);
    setSearchTerm("");
  };

  return (
    <MDBContainer>
      <MDBModal isOpen={props.showModal} toggle={props.toggleModal} centered>
        <MDBModalHeader
          toggle={e => {
            setSearchTerm("");
            setSearchResults({});
            props.toggleModal();
          }}
        >
          {`Search for ${
            props.userInfo.userType === "teacher" ? "Mentors" : "Teachers"
          }`}
        </MDBModalHeader>
        <MDBModalBody>
          <MDBFormInline
            className="md-form"
            onSubmit={async e => {
              e.preventDefault();
              await searchParticipants(searchTerm);
            }}
          >
            <input
              className="form-control form-control-sm w-75"
              type="text"
              placeholder={`Search ${
                props.userInfo.userType === "teacher" ? "Mentors" : "Teachers"
              }`}
              aria-label={`Search ${
                props.userInfo.userType === "teacher" ? "Mentors" : "Teachers"
              }`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <MDBBtn
              color="primary"
              size="sm"
              onClick={async e => {
                e.preventDefault();
                await searchParticipants(searchTerm);
              }}
            >
              <MDBIcon icon="search" />
            </MDBBtn>
          </MDBFormInline>
          {searchResults.length > 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  {`Select ${
                    props.userInfo.userType === "teacher" ? "Mentor" : "Teacher"
                  }`}
                </Typography>
                <List>
                  {searchResults.map(user => {
                    return (
                      <ListItem
                        onClick={e => {
                          props.createConversation(user);
                          props.setSelectedConversation(user);
                          props.toggleModal();
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.photoUrl || blank_user} />
                        </ListItemAvatar>
                        <ListItemText primary={user.fullName} />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          )}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn
            color="secondary"
            onClick={e => {
              setSearchTerm("");
              setSearchResults([]);
              props.toggleModal();
            }}
          >
            Close
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  );
};

export default SearchUsersModal;

// {s
/* <Grid container spacing={2}>
<Grid item xs={12} md={6}>
  <Typography variant="h6">
    {`Select ${props.userInfo.userType === 'teacher' ? 'Mentor' : 'Teacher'}`} 
  </Typography>
    <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
          />
        </ListItem>,
    </List>
</Grid>
</Grid> */
// }
