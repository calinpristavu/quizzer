package webapp

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

func extractParamAsInt(param string, r *http.Request, defaultVal int) int {
	stringVal := r.URL.Query().Get(param)
	if stringVal == "" {
		return defaultVal
	}

	intVal, err := strconv.Atoi(stringVal)
	if err != nil {
		logrus.Errorf("could not convert page string('%s') to int", stringVal)
	}

	return intVal
}

func extractParamAsIntSlice(param string, r *http.Request) []int {
	var params []int

	stringVal := r.URL.Query().Get(param)
	if stringVal == "" {
		return params
	}

	strs := strings.Split(stringVal, ",")
	for _, str := range strs {
		intVal, err := strconv.Atoi(str)
		if err != nil {
			logrus.Errorf("could not convert '%s' to int: %v", str, err)
			continue
		}

		params = append(params, intVal)
	}

	return params
}
