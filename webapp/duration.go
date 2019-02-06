package webapp

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
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

	asString := string(dbValue.([]uint8))

	newD, _ := time.ParseDuration(asString)

	*d = Duration{newD}

	return nil
}

func (d Duration) MarshalJSON() ([]byte, error) {
	if d.Duration.Nanoseconds() == 0 {
		return json.Marshal(nil)
	}

	return json.Marshal(d.String())
}

func (d *Duration) UnmarshalJSON(b []byte) error {
	var v interface{}
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}

	if v == nil {
		return nil
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
