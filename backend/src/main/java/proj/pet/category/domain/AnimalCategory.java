package proj.pet.category.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import proj.pet.utils.domain.IdentityDomain;
import proj.pet.utils.domain.RuntimeExceptionThrower;
import proj.pet.utils.domain.Validatable;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "ANIMAL_CATEGORY")
@NoArgsConstructor(access = PROTECTED)
@Getter
public class AnimalCategory extends IdentityDomain implements Validatable {

	private static final int MAX_NAME_LENGTH = 32;

	@Column(name = "SPECIES", nullable = false, length = MAX_NAME_LENGTH)
	@Enumerated(EnumType.STRING)
	private Species species;

	private AnimalCategory(Species species) {
		this.species = species;
		RuntimeExceptionThrower.checkValidity(this);
	}

	public static AnimalCategory of(Species species) {
		return new AnimalCategory(species);
	}

	@Override public boolean isValid() {
		return species != null
				&& species.name().length() <= MAX_NAME_LENGTH;
	}

	public String getCategoryName() {
		return species.name();
	}
}
