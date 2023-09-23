/******************************************************************************
 * This header file was code-generated on Tue, 19 Sep 2023 13:18:52 GMT, using:
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
 * By: Mean-UI-Thread - Copyright (c) 2023 - All rights reserved
 * https://github.com/mean-ui-thread/soa-c#readme
 *
 * ----------------------------------------------------------------------------
 *
 * sceneNode - A nestable structure that contains transformation properties of 
 * graphical and non-graphical elements. Building block of a scene tree.
 *
 * Author: Mean-UI-Thread
 *
 * Before including this single-file header in *one* C or C++ file to create, 
 * do the following:
 *   #define SCENE_NODE_IMPLEMENTATION
 *
 * For example, it should look like this:
 *   #include ...
 *   #include ...
 *   #define SCENE_NODE_IMPLEMENTATION
 *   #include "sceneNode.h"
 *
 * Optionally, you can:
 *   - #define SCENE_NODE_ASSERT(x) before the #include to override the 
 *   default.
 *   - #define SCENE_NODE_MALLOC(x) before the #include to override the 
 *   default.
 *   - #define SCENE_NODE_REALLOC(x) before the #include to override the 
 *   default.
 *   - #define SCENE_NODE_FREE(x) before the #include to override the default.
 *****************************************************************************/
#ifndef SCENE_NODE_H
#define SCENE_NODE_H

#include <stddef.h> /* size_t */


#ifdef __cplusplus
extern "C" {
#endif

/**
 * sceneNode Index. This is used to track instances.
 */
typedef struct
{
    size_t* idx;
    size_t _capacity;
    size_t _count;
} sceneNodeIndex_t;

/**
 * sceneNode Manager. This structure contains all the data of every 
 * sceneNode instances in a structure-of-array form.
 * sceneNode Manager
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
    sceneNodeIndex_t _instances;
    sceneNodeIndex_t _available;
} sceneNodeManager_t;

/**
 * sceneNode instance.
 * Instanticate using sceneNodeCreate()
 * Destroy using sceneNodeDestroy()
 */
typedef struct {
    sceneNodeManager_t *mgr;
    size_t idx;
} sceneNode_t;

/**
 * sceneNode manager create
 * Creates the SOA management structure instance behind the scene.
 * @sa sceneNodeManagerDestroy
 */
sceneNodeManager_t* sceneNodeManagerCreate(void);

/**
 * sceneNode manager destroy
 * Destroys the SOA management structure instance behind the scene.
 * @sa sceneNodeManagerCreate
 */
void sceneNodeManagerDestroy(sceneNodeManager_t *mgr);

/**
 * sceneNode Instance Allocator.
 * This function instantiates a new sceneNode instance
 * @sa sceneNodeDestroy
 */
sceneNode_t sceneNodeCreate(sceneNodeManager_t *mgr);

/**
 * sceneNode Instance Deallocator.
 * This function destroys a sceneNode instance
 * @sa sceneNodeCreate
 */
void sceneNodeDestroy(sceneNode_t instance);

/**
 * Getter for positionX
 * horizontal position of a scene node in pixel fragment unit
 * @param instance the sceneNode instance
 * @return The value of positionX
 * @sa sceneNodeSetPositionX
 */
float sceneNodeGetPositionX(sceneNode_t instance);

/**
 * Setter for positionX
 * horizontal position of a scene node in pixel fragment unit
 * @param instance the sceneNode instance
 * @param positionX The value of positionX
 * @sa sceneNodeGetPositionX
 */
void sceneNodeSetPositionX(sceneNode_t instance, float positionX);

/**
 * Getter for positionY
 * vertical position of a scene node in pixel fragment unit
 * @param instance the sceneNode instance
 * @return The value of positionY
 * @sa sceneNodeSetPositionY
 */
float sceneNodeGetPositionY(sceneNode_t instance);

/**
 * Setter for positionY
 * vertical position of a scene node in pixel fragment unit
 * @param instance the sceneNode instance
 * @param positionY The value of positionY
 * @sa sceneNodeGetPositionY
 */
void sceneNodeSetPositionY(sceneNode_t instance, float positionY);

/**
 * Getter for rotation
 * Z-rotation angle of a scene node in radians
 * @param instance the sceneNode instance
 * @return The value of rotation
 * @sa sceneNodeSetRotation
 */
float sceneNodeGetRotation(sceneNode_t instance);

/**
 * Setter for rotation
 * Z-rotation angle of a scene node in radians
 * @param instance the sceneNode instance
 * @param rotation The value of rotation
 * @sa sceneNodeGetRotation
 */
void sceneNodeSetRotation(sceneNode_t instance, float rotation);

/**
 * Getter for scaleX
 * horizontal scaling of a scene node in multiplication factor
 * @param instance the sceneNode instance
 * @return The value of scaleX
 * @sa sceneNodeSetScaleX
 */
float sceneNodeGetScaleX(sceneNode_t instance);

/**
 * Setter for scaleX
 * horizontal scaling of a scene node in multiplication factor
 * @param instance the sceneNode instance
 * @param scaleX The value of scaleX
 * @sa sceneNodeGetScaleX
 */
void sceneNodeSetScaleX(sceneNode_t instance, float scaleX);

/**
 * Getter for scaleY
 * vertical scaling of a scene node in multiplicaton factor
 * @param instance the sceneNode instance
 * @return The value of scaleY
 * @sa sceneNodeSetScaleY
 */
float sceneNodeGetScaleY(sceneNode_t instance);

/**
 * Setter for scaleY
 * vertical scaling of a scene node in multiplicaton factor
 * @param instance the sceneNode instance
 * @param scaleY The value of scaleY
 * @sa sceneNodeGetScaleY
 */
void sceneNodeSetScaleY(sceneNode_t instance, float scaleY);

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

sceneNodeManager_t* sceneNodeManagerCreate(void)
{
     sceneNodeManager_t* mgr = malloc(sizeof(sceneNodeManager_t));

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

void sceneNodeManagerDestroy(sceneNodeManager_t* mgr)
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
