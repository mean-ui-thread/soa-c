cmake_minimum_required(VERSION 3.13)
project(sceneNode_example)

add_library(${PROJECT_NAME} 
    examples/sceneNode/SceneNode.c
    examples/sceneNode/SceneNode.h
)

if (MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE
        /W4
        /WX
    )
else()
    target_compile_options(${PROJECT_NAME} PRIVATE
        -pedantic
        -Wall
        -Wextra
        -Wmissing-prototypes
        -Wstrict-prototypes
        -Wold-style-definition
        -Werror
    )
endif()