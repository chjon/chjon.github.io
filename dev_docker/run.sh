#!/bin/bash

# This script manages a docker container for development.

function print_help_str {
    echo "Usage: ${0} <start|attach|delete>"
}

if [[ $# -ne 1 ]]; then
    print_help_str
    exit 1
fi

SCRIPT_PATH=$(realpath $0)
REPO_DIR="${SCRIPT_PATH%/dev_docker/*}"
CACHE_FILE="${REPO_DIR}/dev_docker/cache.txt"
CONTAINER_NAME='dev_docker'
USER_ID=$(id -u)

COMMAND=$1
if [[ ${COMMAND} == 'start' ]]; then
    docker build -t "${CONTAINER_NAME}" "${REPO_DIR}/dev_docker" && \
    docker run -id -w "${REPO_DIR}" --net=host --volume "${REPO_DIR}:/${REPO_DIR}/:rshared" "${CONTAINER_NAME}" > "${CACHE_FILE}" && \
    docker exec -u "${USER_ID}" -it $(cat "${CACHE_FILE}") bash
elif [[ ${COMMAND} == 'attach' ]]; then
    if [[ -f ${CACHE_FILE} ]]; then
        docker exec -u "${USER_ID}" -it $(cat "${CACHE_FILE}") bash
    fi
elif [[ ${COMMAND} == 'root' ]]; then
    if [[ -f ${CACHE_FILE} ]]; then
        docker exec -it $(cat "${CACHE_FILE}") bash
    fi
elif [[ ${COMMAND} == 'delete' ]]; then
    if [[ -f ${CACHE_FILE} ]]; then
        docker rm -f $(cat "${CACHE_FILE}") && rm "${CACHE_FILE}"
    fi
else
    print_help_str
    exit 1
fi