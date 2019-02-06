package webapp

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

type Duration struct {
	time.Duration
}

func (d Duration) Value() (driver.Value, error) {
	return driver.String.ConvertValue(d)
}

func (d *Duration) Scan(dbValue interface{}) error {
	if dbValue == nil {
		return nil
	}

	fmt.Printf("%T %+v\n", dbValue, dbValue)

	asInt := string(dbValue.([]uint8))

	fmt.Printf("%T %+v\n", asInt, asInt)

	newD, _ := time.ParseDuration(asInt)

	fmt.Printf("%T %+v\n", newD, newD)

	*d = Duration{newD}

	return nil
}

func (d Duration) MarshalJSON() ([]byte, error) {
	return json.Marshal(d.String())
}

func (d *Duration) UnmarshalJSON(b []byte) error {
	var v interface{}
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}
	switch value := v.(type) {
	case float64:
		d.Duration = time.Duration(value)
		return nil
	case string:
		var err error
		d.Duration, err = time.ParseDuration(value)
		if err != nil {
			return err
		}
		return nil
	default:
		return errors.New("invalid duration")
	}
}
