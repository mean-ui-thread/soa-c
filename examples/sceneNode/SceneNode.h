/******************************************************************************
 * DO NOT EDIT!!! This header file was code-generated on Sun, 24 Sep 2023 
 * 23:33:48 GMT, using:
 *
 * ███████╗ ██████╗  █████╗        ██████╗
 * ██╔════╝██╔═══██╗██╔══██╗      ██╔════╝
 * ███████╗██║   ██║███████║█████╗██║     
 * ╚════██║██║   ██║██╔══██║╚════╝██║     
 * ███████║╚██████╔╝██║  ██║      ╚██████╗
 * ╚══════╝ ╚═════╝ ╚═╝  ╚═╝       ╚═════╝ v0.0.1
 * A CLI that generates Struct-of-Arrays (SOA) C code from a JSON descriptor 
 * file.
 *
 * By: Mean-UI-Thread - Copyright (c) 2023 - All rights reserved.
 * https://github.com/mean-ui-thread/soa-c#readme
 *
 * ----------------------------------------------------------------------------
 *
 * SceneNode, by John Smith : A nestable structure that contains transformation 
 * properties of graphical and non-graphical elements. Building block of a 
 * scene tree.
 *
 * Before including this single-file header in *one* C or C++ file to create, 
 * do the following:
 *   #define SCENE_NODE_IMPLEMENTATION
 *
 * For example, it should look like this:
 *   #include ...
 *   #include ...
 *   #define SCENE_NODE_IMPLEMENTATION
 *   #include "SceneNode.h"
 *
 * Optionally, you can define the following before including this header:
 *   #define SCENE_NODE_ALIGNMENT ...
 *   #define SCENE_NODE_ASSERT(condition) ...
 *   #define SCENE_NODE_ALIGNED_ALLOC(align, ptr) ...
 *   #define SCENE_NODE_ALIGNED_FREE(ptr) ...
 *   #define SCENE_NODE_ALIGNED_REALLOC(ptr, align, ptr) ...
 *   #define SCENE_NODE_MALLOC_USABLE_SIZE(ptr) ...
 *   #define SCENE_NODE_IMPLEMENTATION
 *   #include "SceneNode.h"
 *
 *****************************************************************************/

/******************************************************************************
 * MIT License Copyright (c) 2023 John Smith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice (including the next 
 * paragraph) shall be included in all copies or substantial portions of the 
 * Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 *****************************************************************************/

#ifndef SCENE_NODE_H
#define SCENE_NODE_H

#include <stddef.h> /* size_t */

#ifdef __cplusplus
extern "C" {
#endif

/**
 * SceneNode Index Structure. This is used to track instances.
 */
typedef struct
{
    size_t* idx;
    size_t _capacity;
    size_t _count;
} SceneNodeIndex;

/**
 * SceneNode Manager Structure. This structure contains all the data of every 
 * SceneNode instances in a structure-of-array form.
 * SceneNode Manager
 * @sa sceneNodeCreate
 * @sa sceneNodeDestroy
 * @sa sceneNodeManagerCreate
 * @sa sceneNodeManagerDestroy
 */
typedef struct
{
    float* positionX;
    float* positionY;
    float* rotation;
    float* scaleX;
    float* scaleY;

    size_t _capacity;
    size_t _count;
    SceneNodeIndex _instances;
    SceneNodeIndex _available;
} SceneNodeManager;

/**
 * SceneNode instance.
 * Instantiate using sceneNodeCreate
 * Destroy using sceneNodeCreate
 */
typedef struct {
    SceneNodeManager *mgr;
    size_t idx;
} SceneNode;

/**
 * SceneNodeManager Instance Allocator.
 * Creates the SOA management structure instance behind the scene.
 * @sa sceneNodeManagerDestroy
 */
SceneNodeManager* sceneNodeManagerCreate(void);

/**
 * SceneNodeManager Instance Deallocation
 * Destroys the SOA management structure instance behind the scene.
 * @sa sceneNodeManagerCreate
 */
void sceneNodeManagerDestroy(SceneNodeManager *mgr);

/**
 * SceneNode Instance Allocator.
 * This function instantiates a new SceneNode instance.
 * @sa sceneNodeDestroy
 */
SceneNode sceneNodeCreate(SceneNodeManager *mgr);

/**
 * SceneNode Instance Deallocation.
 * This function destroys a SceneNode instance.
 * @sa sceneNodeCreate
 */
void sceneNodeDestroy(SceneNode instance);

/**
 * Getter for positionX
 * horizontal position of a scene node in pixel fragment unit
 * @param instance the SceneNode instance.
 * @return The value of positionX
 * @sa sceneNodeSetPositionX
 */
float sceneNodeGetPositionX(SceneNode instance);

/**
 * Setter for positionX
 * horizontal position of a scene node in pixel fragment unit
 * @param instance the SceneNode instance.
 * @return The value of positionX
 * @sa sceneNodeGetPositionX
 */
void sceneNodeSetPositionX(SceneNode instance, float positionX);


/**
 * Getter for positionY
 * vertical position of a scene node in pixel fragment unit
 * @param instance the SceneNode instance.
 * @return The value of positionY
 * @sa sceneNodeSetPositionY
 */
float sceneNodeGetPositionY(SceneNode instance);

/**
 * Setter for positionY
 * vertical position of a scene node in pixel fragment unit
 * @param instance the SceneNode instance.
 * @return The value of positionY
 * @sa sceneNodeGetPositionY
 */
void sceneNodeSetPositionY(SceneNode instance, float positionY);


/**
 * Getter for rotation
 * Z-rotation angle of a scene node in radians
 * @param instance the SceneNode instance.
 * @return The value of rotation
 * @sa sceneNodeSetRotation
 */
float sceneNodeGetRotation(SceneNode instance);

/**
 * Setter for rotation
 * Z-rotation angle of a scene node in radians
 * @param instance the SceneNode instance.
 * @return The value of rotation
 * @sa sceneNodeGetRotation
 */
void sceneNodeSetRotation(SceneNode instance, float rotation);


/**
 * Getter for scaleX
 * horizontal scaling of a scene node in multiplication factor
 * @param instance the SceneNode instance.
 * @return The value of scaleX
 * @sa sceneNodeSetScaleX
 */
float sceneNodeGetScaleX(SceneNode instance);

/**
 * Setter for scaleX
 * horizontal scaling of a scene node in multiplication factor
 * @param instance the SceneNode instance.
 * @return The value of scaleX
 * @sa sceneNodeGetScaleX
 */
void sceneNodeSetScaleX(SceneNode instance, float scaleX);


/**
 * Getter for scaleY
 * vertical scaling of a scene node in multiplicaton factor
 * @param instance the SceneNode instance.
 * @return The value of scaleY
 * @sa sceneNodeSetScaleY
 */
float sceneNodeGetScaleY(SceneNode instance);

/**
 * Setter for scaleY
 * vertical scaling of a scene node in multiplicaton factor
 * @param instance the SceneNode instance.
 * @return The value of scaleY
 * @sa sceneNodeGetScaleY
 */
void sceneNodeSetScaleY(SceneNode instance, float scaleY);


#ifdef __cplusplus
}
#endif

#endif /* SCENE_NODE_H */

#ifdef SCENE_NODE_IMPLEMENTATION

#include <assert.h>
#if defined(__APPLE__)
    #include <malloc/malloc.h>
    #include <stdalign.h>
    #include <stdlib.h>
    #include <string.h>
#elif defined(__linux__)
    #include <malloc.h>
    #include <stdalign.h>
    #include <stdlib.h>
    #include <string.h>
#elif defined(_MSC_VER)
    #include <malloc.h>
#endif

#ifndef SCENE_NODE_ALIGNMENT
    #define SCENE_NODE_ALIGNMENT 64 /* Large enough for AVX-512 */
#endif

#ifndef SCENE_NODE_ASSERT
    #define SCENE_NODE_ASSERT(condition) assert(condition)
#endif

#if defined(SCENE_NODE_ALIGNED_ALLOC) && defined(SCENE_NODE_ALIGNED_FREE) && defined(SCENE_NODE_ALIGNED_REALLOC)
    /* valid */
#elif !defined(SCENE_NODE_ALIGNED_ALLOC) && !defined(SCENE_NODE_ALIGNED_FREE) && !defined(SCENE_NODE_ALIGNED_REALLOC)
    /* valid */
#else
    #error "Must define all or none of SCENE_NODE_ALIGNED_ALLOC, SCENE_NODE_ALIGNED_FREE, and SCENE_NODE_ALIGNED_REALLOC."
#endif

#ifndef SCENE_NODE_MALLOC_USABLE_SIZE
    #if defined(__APPLE__)
        #define SCENE_NODE_MALLOC_USABLE_SIZE(ptr) malloc_size(ptr)
    #elif defined(__linux__)
        #define SCENE_NODE_MALLOC_USABLE_SIZE(ptr) malloc_usable_size(ptr)
    #else
        #define SCENE_NODE_MALLOC_USABLE_SIZE(ptr)
    #endif
#endif /* SCENE_NODE_MALLOC_USABLE_SIZE */

#if !defined(SCENE_NODE_ALIGNED_FREE) && !defined(SCENE_NODE_ALIGNED_ALLOC) && !defined(SCENE_NODE_ALIGNED_REALLOC)
    #if defined(__APPLE__) || defined(__linux__)
        #define SCENE_NODE_ALIGNED_FREE(ptr) free(ptr)
        #define SCENE_NODE_ALIGNED_ALLOC(align, size) aligned_alloc(align, size)
        #define SCENE_NODE_ALIGNED_REALLOC(ptr, align, size) do {\
            if ((size == 0) || (align <= alignof(max_align_t)))\
            {\
                return realloc(ptr, size);\
            }\
            size_t new_size = (size + (align - 1)) & (~(align - 1));\
            void *new_ptr = aligned_alloc(align, new_size);\
            if (new_ptr != NULL)\
            {\
                size_t old_usable_size = SCENE_NODE_MALLOC_USABLE_SIZE(ptr);\
                size_t copy_size = new_size < old_usable_size ? new_size : old_usable_size;\
                if (ptr != NULL)\
                {\
                    memcpy(new_ptr, ptr, copy_size);\
                    free(ptr);\
                }\
            }\
            return new_ptr;\
        } while(0)
    #elif defined(_MSC_VER)
        #define SCENE_NODE_ALIGNED_FREE(ptr) _aligned_free(ptr)
        #define SCENE_NODE_ALIGNED_ALLOC(align, size) _aligned_alloc(size, align)
        #define SCENE_NODE_ALIGNED_REALLOC(ptr, align, size) _aligned_realloc(ptr, size, align);
    #else
        #define SCENE_NODE_ALIGNED_FREE(ptr) free(ptr)
        #define SCENE_NODE_ALIGNED_ALLOC(align, size) malloc(size)
        #define SCENE_NODE_ALIGNED_REALLOC(ptr, align, size) realloc(ptr, size)
    #endif
#endif

#ifdef __cplusplus
extern "C" {
#endif

SceneNodeManager* sceneNodeManagerCreate(void)
{
    SceneNodeManager* mgr = malloc(sizeof(SceneNodeManager));

    mgr->positionX = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(float));
    mgr->positionY = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(float));
    mgr->rotation = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(float));
    mgr->scaleX = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(float));
    mgr->scaleY = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(float));
    mgr->_capacity = SCENE_NODE_ALIGNMENT;
    mgr->_count = 0;

    mgr->_instances.idx = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(size_t));
    mgr->_instances._capacity = SCENE_NODE_ALIGNMENT;
    mgr->_instances._count = 0;

    mgr->_available.idx = SCENE_NODE_ALIGNED_ALLOC(SCENE_NODE_ALIGNMENT, SCENE_NODE_ALIGNMENT * sizeof(size_t));
    mgr->_available._capacity = SCENE_NODE_ALIGNMENT;
    mgr->_available._count = 0;

    return mgr;
}

void sceneNodeManagerDestroy(SceneNodeManager* mgr)
{
    SCENE_NODE_ALIGNED_FREE(mgr->positionX);
    SCENE_NODE_ALIGNED_FREE(mgr->positionY);
    SCENE_NODE_ALIGNED_FREE(mgr->rotation);
    SCENE_NODE_ALIGNED_FREE(mgr->scaleX);
    SCENE_NODE_ALIGNED_FREE(mgr->scaleY);
    mgr->positionX = NULL;
    mgr->positionY = NULL;
    mgr->rotation = NULL;
    mgr->scaleX = NULL;
    mgr->scaleY = NULL;
    mgr->_count = 0;
    mgr->_capacity = 0;

    SCENE_NODE_ALIGNED_FREE(mgr->_instances.idx);
    mgr->_instances.idx = NULL;
    mgr->_instances._count = 0;
    mgr->_instances._capacity = 0;

    SCENE_NODE_ALIGNED_FREE(mgr->_available.idx);
    mgr->_available.idx = NULL;
    mgr->_available._count = 0;
    mgr->_available._capacity = 0;

    free(mgr);
}


#ifdef __cplusplus
}
#endif

#endif /* SCENE_NODE_IMPLEMENTATION */
