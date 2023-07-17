cmake_minimum_required (VERSION 3.1)
include(CMakePrintHelpers)
project (eigen_test)

set(EIGEN_DIR ${PROJECT_SOURCE_DIR}/../../../lib/eigen)
cmake_print_variables(EIGEN_DIR)

list(APPEND CMAKE_MODULE_PATH ${EIGEN_DIR}/build)
find_package(Eigen3 REQUIRED)

add_definitions(-D_CRT_SECURE_NO_WARNINGS)

set (CMAKE_CXX_STANDARD 11)

include_directories(
  ${EIGEN_DIR}
  ${PROJECT_SOURCE_DIR}
  ${PROJECT_SOURCE_DIR}/simplicalcholesky/
  ${PROJECT_SOURCE_DIR}/../../cpp/
)

link_directories(${EIGEN_DIR})

add_executable(${PROJECT_NAME} benchmark.cpp
  simplicialcholesky/Tutorial_sparse_example.cpp
)

target_link_libraries(${PROJECT_NAME}
  ${EIGEN_DIR}/build
)
