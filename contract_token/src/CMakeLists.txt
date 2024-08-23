project(soapboxtoken)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract(soapboxtoken soapboxtoken soapboxtoken.cpp)
target_include_directories(soapboxtoken PUBLIC ${CMAKE_SOURCE_DIR}/../include)
target_ricardian_directory(soapboxtoken ${CMAKE_SOURCE_DIR}/../ricardian)
