package webapp

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

const recruiteeApi = "https://api.recruitee.com/c/14378"

type CandidatesResponse struct {
	Total int         `json:"total"`
	Hits  []Candidate `json:"hits"`
}

type Candidate struct {
	Emails []string `json:"emails"`
	ID     int      `json:"id"`
}

func findInRecruitee() []Candidate {
	endpoint := `/search/new/candidates?filters_json=`
	filterString := `[{%22field%22:%22stages%22,%22has_one_of%22:[%22Testing%20stage%22]},{%22field%22:%22jobs_ids%22,%22has_one_of%22:[204671]}]%0A`

	// Create a Bearer string by appending string access token
	var bearer = "Bearer " + os.Getenv("RECRUITEE_TOKEN")

	// Create a new request using http
	req, err := http.NewRequest("GET", recruiteeApi+endpoint+filterString, nil)

	// add authorization header to the req
	req.Header.Add("Authorization", bearer)

	// Send req using http Client
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error on response.\n[ERRO] -", err)
	}

	// parse the response
	var cr CandidatesResponse
	err = json.NewDecoder(resp.Body).Decode(&cr)
	if err != nil {
		log.Fatalf("could not decode body: %+v", err)
	}

	return cr.Hits
}
