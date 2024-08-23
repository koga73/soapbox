project(soapboxmain)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract(soapboxmain soapboxmain soapboxmain.cpp)
target_include_directories(soapboxmain PUBLIC ${CMAKE_SOURCE_DIR}/../include)
target_ricardian_directory(soapboxmain ${CMAKE_SOURCE_DIR}/../ricardian)
