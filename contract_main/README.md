# Soapbox Main Contract

This contract handles the main functionality of the Soapbox platform. It allows users to post messages, follow other users, and interact with the banking system.

## Functionality

### Actions

-   shout
-   follow
-   unfollow
-   deleteself
-   deleteall
-   withdraw

### Banking

The banking system allows users to deposit and withdraw tokens from their account. The contract also has a system for distributing rewards to users based on their activity on the platform.

## Building

How to build

-   mkdir "build"
-   cd to 'build' directory
-   run the command 'cmake ..'
-   run the command 'make'

## Deploying

    -   The built smart contract is in the 'build/soapboxmain' directory
    -   You can then do a 'set contract' action with 'cleos' and point in to the './build/soapboxmain' directory

## Notes

-   Additions to CMake should be done to the CMakeLists.txt in the './src' directory and not in the top level CMakeLists.txt
