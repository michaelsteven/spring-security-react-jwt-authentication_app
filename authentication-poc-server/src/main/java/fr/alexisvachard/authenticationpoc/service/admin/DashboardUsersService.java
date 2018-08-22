package fr.alexisvachard.authenticationpoc.service.admin;

import fr.alexisvachard.authenticationpoc.model.User;
import fr.alexisvachard.authenticationpoc.repository.PagedUserRepository;
import fr.alexisvachard.authenticationpoc.repository.UserRepository;
import fr.alexisvachard.authenticationpoc.web.admin.dto.PagedResponse;
import fr.alexisvachard.authenticationpoc.web.admin.dto.UserDto;
import fr.alexisvachard.authenticationpoc.web.common.dto.ApiResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardUsersService {

    private UserRepository userRepository;
    private PagedUserRepository pagedUserRepository;

    @Autowired
    public DashboardUsersService(UserRepository userRepository, PagedUserRepository pagedUserRepository) {
        this.userRepository = userRepository;
        this.pagedUserRepository = pagedUserRepository;
    }

    public ResponseEntity<?> getUsers(int page, int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = pagedUserRepository.findAll(pageable);

        if(usersPage.getContent().isEmpty()){
            return new ResponseEntity<>(new ApiResponseDto(false, "Unable to retrieve any user"), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        final List<UserDto> users = usersPage.getContent()
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());

        return new ResponseEntity<>(new PagedResponse(users, usersPage), HttpStatus.OK);
    }
}